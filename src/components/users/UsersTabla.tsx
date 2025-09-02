import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import type { UsersType } from './type';
import { Box, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Undo as UndoIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { GridSortModel } from '@mui/x-data-grid';
interface Props {
  users: UsersType[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
  handleDelete: (id: number) => void;
  //handleDone: (id: number, done: string) => void;
  handleOpenEditDialog: (user: UsersType) => void;
}

export const UsersTabla = ({
  users,
  rowCount,
  paginationModel,
  setPaginationModel,
  setSortModel,
  sortModel,
  handleDelete,
  //handleDone: handledone,
  handleOpenEditDialog
}: Props) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Usuario', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === "active" ? 'Hecho' : 'Pendiente'}
          color={params.value === "active" ? 'success' : 'warning'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction={'row'} spacing={1}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenEditDialog(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              params.row.done === "active" ? 'Marcar pendiente' : 'Marcar hecho'
            }
          >
            <IconButton
              size="small"
              color={params.row.done === "active" ? 'warning' : 'success'}
              onClick={() => console.log("editar")
                // handledone(params.row.id, params.row.done)

              }
            >
              {params.row.done === "active" ? (
                <UndoIcon fontSize="small" />
              ) : (
                <DoneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => 
                handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box height={545}>
      <DataGrid
        rows={users}
        columns={columns}
        rowCount={rowCount ?? 0}
        paginationMode={"server"}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode={"server"}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[5, 10, 20]}
        disableColumnFilter        
      />
    </Box>
  );
};
