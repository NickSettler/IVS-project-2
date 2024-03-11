import { JSX, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  styled,
  IconButton,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Calculator } from './components/calculator/Calculator.tsx';
import { Info } from './components/info/Info.tsx';
import { Settings } from '@mui/icons-material';
import { AppDrawer } from './components/common/AppDrawer.tsx';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',

  [theme.breakpoints.down('md')]: {
    height: 'auto',
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: 0,

  [theme.breakpoints.down('md')]: {
    padding: `0 ${theme.spacing(1)}`,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: theme.spacing(2),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },

  '& > *': {
    '&:last-child': {
      flexGrow: 1,
    },

    [theme.breakpoints.down('md')]: {
      flexGrow: 0,
      width: '100%',
    },
  },
}));

const App = (): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <Wrapper>
      <AppBar component='nav'>
        <Toolbar>
          <Typography variant='h6' component='div'>
            IVS Calculator
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color={'inherit'} onClick={handleDrawerToggle}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AppDrawer isOpen={drawerOpen} onClose={handleDrawerToggle} />
      <CssBaseline />
      <MainContainer component='main'>
        <Toolbar sx={{ mb: 1 }} />
        <ContentContainer>
          <Calculator />
          <Info />
        </ContentContainer>
      </MainContainer>
      <Toaster position='bottom-right' reverseOrder={false} />
    </Wrapper>
  );
};

export default App;
