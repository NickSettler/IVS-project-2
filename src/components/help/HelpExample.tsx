import { JSX } from 'react';
import { Box, IconButton, styled, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { ContentCopy } from '@mui/icons-material';

const ExampleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: theme.spacing(1),
}));

export type THelpExampleProps = {
  example: string;
  result: string;
};

export const HelpExample = ({
  example,
  result,
}: THelpExampleProps): JSX.Element => {
  const copyExample = async () => {
    await navigator.clipboard.writeText(example);
    toast.success('Example copied to clipboard');
  };

  return (
    <ExampleBox>
      <Typography>
        <code>
          {example} = {result}
        </code>
      </Typography>
      <IconButton onClick={copyExample} color={'primary'} size={'small'}>
        <ContentCopy fontSize={'small'} />
      </IconButton>
    </ExampleBox>
  );
};
