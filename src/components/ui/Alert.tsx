"use client";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const alertStyles = {
  success: {
    container: "bg-green-50 border border-green-200",
    icon: "✅",
    iconColor: "text-green-400",
    textColor: "text-green-700",
    closeColor: "text-green-400 hover:text-green-600",
  },
  error: {
    container: "bg-red-50 border border-red-200",
    icon: "❌",
    iconColor: "text-red-400",
    textColor: "text-red-700",
    closeColor: "text-red-400 hover:text-red-600",
  },
  warning: {
    container: "bg-yellow-50 border border-yellow-200",
    icon: "⚠️",
    iconColor: "text-yellow-400",
    textColor: "text-yellow-700",
    closeColor: "text-yellow-400 hover:text-yellow-600",
  },
  info: {
    container: "bg-blue-50 border border-blue-200",
    icon: "ℹ️",
    iconColor: "text-blue-400",
    textColor: "text-blue-700",
    closeColor: "text-blue-400 hover:text-blue-600",
  },
};

export function Alert({
  type,
  message,
  onClose,
  dismissible = true,
}: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div className={`p-4 rounded-md ${styles.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`mr-2 ${styles.iconColor}`}>{styles.icon}</span>
          <span className={`text-sm ${styles.textColor}`}>{message}</span>
        </div>
        {dismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={styles.closeColor}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
