import { Box } from '@mui/material';
import {
  UsersDialog,
  UsersFilter,
  UsersHeader,
  UsersTabla,
  type UsersActionState,
} from '../../components/';
import { useCallback, useEffect, useState } from 'react';
import type { UsersFilterDoneType, UsersType } from '../../components/users/type';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useAlert, useAxios } from '../../hooks';
import { errorHelper, hanleZodError } from '../../helpers';
import { schemaUsuarios, type UsuariosFormValues } from '../../models';

export const UsuariosPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [filterStatus, setFilterStatus] = useState<UsersFilterDoneType>('all');
  const [search, setSearch] = useState('');
  const [usuarios, setUsuarios] = useState<UsersType[]>([]);
  const [total, setTotal] = useState(0);

  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<UsersType | null>(null);

  const listUsersApi = useCallback(async () => {
    try {
      // Logs de depuración
      // console.log('render listUsersApi with ->', {
      //   page: paginationModel.page,
      //   pageSize: paginationModel.pageSize,
      //   sortField: sortModel?.[0]?.field,
      //   sortDir: sortModel?.[0]?.sort,
      //   search,
      //   filterStatus,
      // });
      const orderBy = sortModel?.[0]?.field ?? undefined
      const orderDir = sortModel?.[0]?.sort ?? undefined
      const response = await axios.get('/users', {
        params: {
          page: paginationModel.page + 1, // backend 1-based
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search: search || undefined,
          status: filterStatus === 'all' ? undefined : filterStatus
        }
      })

      // Debug útil
      console.log('GET /users ->', response.data)

      const payload = response.data

      setUsuarios(payload as UsersType[])
      setTotal(
        // si tu backend no devuelve total, usa el tamaño del array como fallback
        typeof (response as any).data?.total === 'number'
          ? (response as any).data.total
          : payload.length
      )
      return
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  }, [
    axios,
    showAlert,
    errorHelper,
    search,
    filterStatus,
    paginationModel.page,
    paginationModel.pageSize,
    sortModel?.[0]?.field,
    sortModel?.[0]?.sort,
  ]);

  useEffect(() => {
    // Dispara en el primer render y cada vez que cambien los primitivos relevantes
    listUsersApi();
  }, [listUsersApi]);

  const handleOpenCreateDialog = () => {
    setOpenDialog(true);
    setUser(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUser(null);
  };

  const handleOpenEditDialog = (users: UsersType) => {
    setOpenDialog(true);
    setUser(users);
  };

  const handleCreateEdit = async (_: UsersActionState | undefined, formdata: FormData) => {
    const rawData = {
      username: formdata.get('username') as string,
    };

    try {
      schemaUsuarios.parse(rawData);

      if (user?.id) {
        await axios.put(`/users/${user.id}`, rawData);
        showAlert('Usuario editado', 'success');
      } else {
        await axios.post('/users', rawData);
        showAlert('Usuario creado', 'success');
      }

      await listUsersApi();
      handleCloseDialog();
      return;
    } catch (error) {
      const err = hanleZodError<UsuariosFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirmed = window.confirm('¿Estás seguro de eliminar?');
      if (!confirmed) return;

      await axios.delete(`/users/${id}`);
      showAlert('Usuario eliminado', 'success');
      await listUsersApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

 
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header con título y botón agregar */}
      <UsersHeader handleOpenCreateDialog={handleOpenCreateDialog} />

      {/* Barra de herramientas con filtros y búsquedas */}
      <UsersFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSearch={setSearch}
      />

      {/* Tabla */}
      <UsersTabla
        users={usuarios}
        rowCount={total}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleDelete={handleDelete}
        // handleDone={handleDone}
        handleOpenEditDialog={handleOpenEditDialog}
      />

      {/* Dialog */}
      <UsersDialog
        open={openDialog}
        user={user}
        onClose={handleCloseDialog}
        handleCreateEdit={handleCreateEdit}
      />
    </Box>
  );
};
