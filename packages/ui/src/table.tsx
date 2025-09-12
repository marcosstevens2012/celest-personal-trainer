// Placeholder components - will be implemented with full ShadCN components later

export const Table = ({ children, ...props }: any) => (
  <table {...props}>{children}</table>
);
export const TableHeader = ({ children, ...props }: any) => (
  <thead {...props}>{children}</thead>
);
export const TableBody = ({ children, ...props }: any) => (
  <tbody {...props}>{children}</tbody>
);
export const TableRow = ({ children, ...props }: any) => (
  <tr {...props}>{children}</tr>
);
export const TableHead = ({ children, ...props }: any) => (
  <th {...props}>{children}</th>
);
export const TableCell = ({ children, ...props }: any) => (
  <td {...props}>{children}</td>
);
