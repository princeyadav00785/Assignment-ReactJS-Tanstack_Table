import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Stack,
} from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const fetchData = async () => {
  const response = await fetch(
    "https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1719259200000&signature=CEN3bg8s18787N-3iOWx7OrqP7M4rkIBBb_80Qo6UPY&downloadName=sample-data.json"
  );
  const data = await response.json();
  return data;
};

export default function App() {
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setLoading(false);

        const categories = data.map((row) => row.category);
        const categoryList = [...new Set(categories)];
        setCategoryList(categoryList);

        const subcategories = data.map((row) => row.subcategory);
        const subcategoryList = [...new Set(subcategories)];
        setSubCategoryList(subcategoryList);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
     console.log(categoryList);
  //    console.log(subcategoryList);
  const columns = useMemo(
    () => [
      {
        accessorKey: "id", 
        header: "ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, 
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, 
      },
      {
        accessorKey: "name", 
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, 
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, 
      },
      {
        accessorFn: (row) => row.category,
        id: "category", 
        header: "Category",
        Header: () => <i>Category</i>, 
        filterVariant: "multi-select",
        filterSelectOptions: categoryList.map((category) => ({
          text: category,
          value: category
        })),
      },
      {
        accessorFn: (row) => row.subcategory,
        id: "subcategory", 
        header: "Sub-Category",
        Header: () => <i>Sub-Category</i>, 
        filterVariant: "select",
        filterSelectOptions: subcategoryList.map((category) => ({
            text: category,
            value: category
          })),
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt", 
        header: "CreatedAt",
        Header: () => <i>CreatedAt</i>, 
        Cell: ({ cell }) => formatDate(cell.getValue()),
        // filterVariant: 'datetime-range',
      },
      {
        accessorFn: (row) => row.updatedAt,
        id: "updatedAt", 
        header: "UpdatedAt",
        Header: () => <i>UpdatedAt</i>, 
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorFn: (row) => row.price,
        id: "price", 
        header: "Price",
        Header: () => <i>Price</i>, 
        filterVariant: "range-slider",
        filterFn: "betweenInclusive", 
        muiFilterSliderProps: {
          marks: true,
          max: 2000, 
          min: 30, 
          step: 100,
        },
      },
      {
        accessorFn: (row) => {
          if (row.sale_price) return row.sale_price;
          else return row.price;
        },
        id: "sale_price", 
        header: "Sales-Price",
        Header: () => <i>Sales-Price</i>, 
        filterVariant: "range-slider",
        filterFn: "betweenInclusive", 
        muiFilterSliderProps: {
          marks: true,
          max: 2000, 
          min: 30, 
          step: 100,
        },
      },
    ],
    []
  );


  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
  }, [rowSelection]);
  const [groupedColumnMode, setGroupedColumnMode] = useState("reorder");

  const table = useMaterialReactTable({
    columns,
    data,
    
    enableFullScreenToggle: false,
    enableGrouping: true,
    groupedColumnMode,
    initialState: {
      expanded: true, 
      grouping: ["category", "subcategory"], 
      pagination: { pageIndex: 1, pageSize: 10 },
    },
    enableColumnOrdering: true, 
    enableRowSelection: true,
    enablePagination: true, 
    onRowSelectionChange: setRowSelection,
    initialState: { showColumnFilters: true },
    state: { rowSelection }, 
    muiTablePaperProps: ({ table }) => ({
      style: {
        bottom: 0,
        height: "100vh",
        left: 0,
        margin: 0,
        maxHeight: "100vh",
        maxWidth: "100vw",
        padding: 0,
        position: "fixed",
        right: 0,
        top: 0,
        width: "100vw",
        zIndex: 999,
      },
    }),
  });

  const someEventHandler = () => {
    console.log(table.getState().sorting);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
      <Stack gap="1rem">
        {/* <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      /> */}
        <MaterialReactTable table={table} />
      </Stack>
      {/* </LocalizationProvider> */}
    </>
  );
}
