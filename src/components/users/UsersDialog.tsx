import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { UsersType } from './type';
import { useActionState } from 'react';
import type { ActionState } from '../../interfaces';
import type { UsuariosFormValues } from '../../models';
import { createInitialState } from '../../helpers';

export type UsersActionState = ActionState<UsuariosFormValues>;

interface Props {
  open: boolean;
  user?: UsersType | null;
  onClose: () => void;
  handleCreateEdit: (
    _: UsersActionState | undefined,
    formData: FormData
  ) => Promise<UsersActionState | undefined>;
}
export const UsersDialog = ({ onClose, open, user, handleCreateEdit }: Props) => {
  const initialState = createInitialState<UsuariosFormValues>();

  const [state, submitAction, isPending] = useActionState(
    handleCreateEdit,
    initialState
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
      <Box key={user?.id ?? 'new'} component={'form'} action={submitAction}>
        <DialogContent>
          <TextField
            name="username"
            autoFocus
            margin="dense"
            label="Nombre del usuario"
            fullWidth
            required
            variant="outlined"
            disabled={isPending}
            defaultValue={state?.formData?.username || user?.username || ''}
            error={!!state?.errors?.username}
            helperText={state?.errors?.username}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress /> : null}
          >
            {user ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
