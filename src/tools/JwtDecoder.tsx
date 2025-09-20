import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Key, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

interface VerificationResult {
  verified: boolean;
  algorithm: string;
  error?: string;
  issuer?: string;
  jwksUri?: string;
}

interface JwkKey {
  kty: string;
  use: string;
  kid: string;
  n?: string;
  e?: string;
  x5c?: string[];
  [key: string]: unknown;
}

interface JwksResponse {
  keys: JwkKey[];
}

interface OpenIdConfiguration {
  issuer: string;
  jwks_uri: string;
  [key: string]: unknown;
}

export const JwtDecoder: React.FC = () => {
  const [jwt, setJwt] = useState('');
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'header' | 'payload' | 'signature'>('payload');
  const { copyToClipboard, copied } = useClipboard();

  // Helper function to convert base64url to Uint8Array
  const base64UrlToUint8Array = useCallback((base64url: string): Uint8Array => {
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  // Function to fetch JWKS from an issuer
  const fetchJwks = useCallback(async (jwksUri: string): Promise<JwksResponse> => {
    const response = await fetch(jwksUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.status}`);
    }
    return response.json();
  }, []);

  // Function to verify JWT signature
  const verifyJwtSignature = useCallback(async (jwt: string, header: Record<string, unknown>, payload: Record<string, unknown>): Promise<VerificationResult> => {
    try {
      const alg = header.alg;
      const kid = header.kid;

      // For now, only support RS256 (RSA signature)
      if (alg !== 'RS256') {
        return {
          verified: false,
          algorithm: alg,
          error: `Algorithm ${alg} not supported. Only RS256 is currently supported.`
        };
      }

      // Try to get issuer from payload
      const issuer = payload.iss;
      if (!issuer) {
        return {
          verified: false,
          algorithm: alg,
          error: 'No issuer (iss) found in JWT payload'
        };
      }

      // Fetch OpenID configuration
      const configUrl = `${issuer}/.well-known/openid-configuration`;
      const configResponse = await fetch(configUrl);
      if (!configResponse.ok) {
        throw new Error(`Failed to fetch OpenID configuration: ${configResponse.status}`);
      }

      const config: OpenIdConfiguration = await configResponse.json();

      // Fetch JWKS
      const jwks = await fetchJwks(config.jwks_uri);

      // Find the correct key
      const key = jwks.keys.find(k => k.kid === kid && k.use === 'sig');
      if (!key) {
        return {
          verified: false,
          algorithm: alg,
          error: `Key with kid '${kid}' not found in JWKS`,
          issuer,
          jwksUri: config.jwks_uri
        };
      }

      // Import the key for verification
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        key,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false,
        ['verify']
      );

      // Create the signing input (header.payload)
      const signingInput = jwt.split('.').slice(0, 2).join('.');
      const signature = jwt.split('.')[2];

      // Convert signature from base64url to Uint8Array
      const signatureBytes = base64UrlToUint8Array(signature);

      // Verify the signature
      const signingInputBytes = new TextEncoder().encode(signingInput);
      const signatureBuffer = new ArrayBuffer(signatureBytes.length);
      new Uint8Array(signatureBuffer).set(signatureBytes);

      const verified = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        publicKey,
        signatureBuffer,
        signingInputBytes
      );

      return {
        verified,
        algorithm: alg,
        issuer,
        jwksUri: config.jwks_uri
      };

    } catch (error) {
      return {
        verified: false,
        algorithm: header.alg || 'unknown',
        error: error instanceof Error ? error.message : 'Signature verification failed'
      };
    }
  }, [fetchJwks, base64UrlToUint8Array]);

  useEffect(() => {
    setError('');
    setDecoded(null);
    setVerification(null);

    if (!jwt.trim()) {
      return;
    }

    const processJwt = async () => {
      try {
        const parts = jwt.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format. Expected header.payload.signature');
        }

        // Decode header
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));

        // Decode payload
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        setDecoded({
          header,
          payload,
          signature: parts[2]
        });

        // Attempt signature verification
        const verificationResult = await verifyJwtSignature(jwt, header, payload);
        setVerification(verificationResult);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to decode JWT');
      }
    };

    processJwt();
  }, [jwt, verifyJwtSignature]);

  const formatJson = (obj: unknown) => {
    return JSON.stringify(obj, null, 2);
  };

  const copyDecoded = (data: unknown) => {
    copyToClipboard(formatJson(data));
  };

  const getExpirationStatus = () => {
    if (!decoded?.payload?.exp) return null;

    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.payload.exp;

    if (exp < now) {
      return { status: 'expired', text: 'Expired', color: 'text-red-400' };
    } else if (exp - now < 3600) { // Less than 1 hour
      return { status: 'expiring', text: 'Expiring Soon', color: 'text-yellow-400' };
    } else {
      return { status: 'valid', text: 'Valid', color: 'text-green-400' };
    }
  };

  const expStatus = getExpirationStatus();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          JWT Decoder
        </h1>
        <p className="text-gray-400">
          Decode and inspect JSON Web Tokens with signature verification support
        </p>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key size={20} />
              JWT Token
            </h3>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {jwt.length} chars
            </div>
          </div>

          <textarea
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            placeholder="Paste your JWT token here (header.payload.signature)..."
            className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Decoded Content */}
      {decoded && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">JWT Parts</h3>

              <div className="space-y-2">
                {(['header', 'payload', 'signature'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-purple-600/20 border border-purple-500/50 text-purple-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{tab}</span>
                      {tab === 'signature' && verification && (
                        verification.verified ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Verification Status */}
              {verification && (
                <div className="mt-6 p-3 rounded-lg border bg-gray-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    {verification.verified ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <span className="text-sm font-medium text-white">
                      Signature {verification.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Algorithm: {verification.algorithm}</div>
                    {verification.issuer && <div>Issuer: {verification.issuer}</div>}
                    {verification.jwksUri && <div>JWKS: {verification.jwksUri}</div>}
                  </div>
                  {verification.error && (
                    <div className="text-xs text-yellow-400 mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      {verification.error}
                    </div>
                  )}
                </div>
              )}

              {/* Expiration Status */}
              {expStatus && (
                <div className="mt-4 p-3 rounded-lg border bg-gray-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className={`${
                      expStatus.status === 'expired' ? 'text-red-500' :
                      expStatus.status === 'expiring' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <span className="text-sm font-medium text-white">Expiration</span>
                  </div>
                  <div className={`text-xs ${expStatus.color}`}>
                    {expStatus.text}
                  </div>
                  {decoded.payload.exp && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(decoded.payload.exp * 1000).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                  <Key size={20} />
                  {activeTab} Content
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyDecoded(decoded[activeTab])}
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </motion.button>
              </div>

              <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 h-96 overflow-auto">
                {activeTab === 'signature' ? (
                  <div className="text-purple-400 font-mono text-sm break-all">
                    {decoded.signature}
                  </div>
                ) : (
                  <pre className="text-purple-400 font-mono text-sm whitespace-pre-wrap">
                    {formatJson(decoded[activeTab])}
                  </pre>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {!decoded && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center">
            <Key size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Enter a JWT Token
            </h3>
            <p className="text-gray-500">
              Paste a JWT token above to decode and inspect its contents
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex justify-center"
      >
        <div className="flex gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            RFC 7519 Compliant
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            JSON Web Token
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            Real-time Decoding
          </div>
        </div>
      </motion.div>
    </div>
  );
};
