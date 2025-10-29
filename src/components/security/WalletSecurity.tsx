import { Wifi } from "lucide-react";

interface WalletSecurityProps {
  isConnected: boolean;
  publicKey?: {
    toString: () => string;
  };
}

export function WalletSecurity({
  isConnected,
  publicKey,
}: WalletSecurityProps) {
  if (!isConnected || !publicKey) {
    return null;
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Wifi className="w-5 h-5 mr-2 text-blue-400" />
        Wallet Security
      </h3>

      <div className="space-y-3">
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-emerald-400 text-sm font-semibold mb-1">
            Wallet Connected Securely
          </p>
          <p className="text-gray-300 text-xs break-all">
            {publicKey.toString()}
          </p>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-3">
          <h4 className="text-white text-sm font-semibold mb-2">
            Security Tips:
          </h4>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>• Never share your private key or seed phrase</li>
            <li>• Use a hardware wallet for large amounts</li>
            <li>• Keep your wallet software updated</li>
            <li>• Double-check transaction details before signing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
