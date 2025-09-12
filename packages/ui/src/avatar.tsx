// Placeholder components - will be implemented with full ShadCN components later

export const Avatar = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
export const AvatarImage = ({ ...props }: any) => <img {...props} />;
export const AvatarFallback = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
