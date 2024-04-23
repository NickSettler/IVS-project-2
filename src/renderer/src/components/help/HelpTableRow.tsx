import { JSX } from 'react';
import { TableCell, TableRow } from '@mui/material';

export type THelpTableRowProps = {
  operation: string;
  operator: string;
  description: string;
  example: string;
  result: string;
};

export const HelpTableRow = ({
  operation,
  operator,
  description,
  example,
}: THelpTableRowProps): JSX.Element => (
  <TableRow>
    <TableCell>{operation}</TableCell>
    <TableCell>
      <code>{operator}</code>
    </TableCell>
    <TableCell>{description}</TableCell>
    <TableCell>
      <code>{example}</code>
    </TableCell>
  </TableRow>
);
