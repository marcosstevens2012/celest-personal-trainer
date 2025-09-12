// Placeholder exports - will be implemented later
export const Toast = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
export const ToastProvider = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
export const useToast = () => ({ toast: () => {} });
