import { JSX } from 'react';
import { TableCell, TableRow } from '@mui/material';

/**
 * Help table row props
 */
export type THelpTableRowProps = {
  /**
   * Operation name
   */
  operation: string;
  /**
   * Operator of the operation
   */
  operator: string;
  /**
   * Operation description
   */
  description: string;
  /**
   * Example of the operation
   */
  example: string;
  /**
   * Result of the operation
   */
  result: string;
};

/**
 * Help table row. Renders table row with operation, operator, description and example
 * @param {THelpTableRowProps} props Help table row props
 * @constructor
 */
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
