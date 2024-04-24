import { JSX, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils';
import { Close } from '@mui/icons-material';

/**
 * App drawer props
 */
export type TAppDrawerProps = {
  /**
   * Is drawer open
   */
  isOpen: boolean;
  /**
   * On close drawer handler
   */
  onClose(): void;
};

/**
 * App drawer. Renders settings drawer
 *
 * @param {TAppDrawerProps} props App drawer props
 * @constructor
 */
export const AppDrawer = ({
  isOpen,
  onClose,
}: TAppDrawerProps): JSX.Element => {
  const theme = useTheme();

  const [drawerWidth, setDrawerWidth] = useState<string>('300px');

  const handleDocumentResize = useCallback(() => {
    setDrawerWidth(
      window.innerWidth > theme.breakpoints.values.md ? '300px' : '100%',
    );
  }, [theme.breakpoints.values.md]);

  useEffect(() => {
    handleDocumentResize();
    window.addEventListener('resize', handleDocumentResize);

    return (): void => {
      window.removeEventListener('resize', handleDocumentResize);
    };
  }, [handleDocumentResize]);

  const container =
    window !== undefined ? (): HTMLElement => window.document.body : undefined;

  const [isAutoComputeEnabled, setIsAutoComputeEnabled] =
    useLocalStorage<boolean>(E_LOCAL_STORAGE_KEYS.ENABLE_AUTO_COMPUTE, false);

  const toggleAutoCompute = (): void => {
    setIsAutoComputeEnabled((prev) => !prev);
  };

  return (
    <Drawer
      container={container}
      anchor={'right'}
      variant='temporary'
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: 'block',
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ mx: 2, my: 1.5 }}
        >
          <Typography variant='h6'>Settings</Typography>
          <IconButton onClick={onClose} size={'small'}>
            <Close />
          </IconButton>
        </Stack>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleAutoCompute}>
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={isAutoComputeEnabled}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={'Enable auto compute'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
