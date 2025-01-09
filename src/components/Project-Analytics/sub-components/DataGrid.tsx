import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

// Define a helper function to get days in a month
function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}

// Define the function to render sparklines
// @ts-expect-error any is okay
function renderSparklineCell(params) {
    const data = getDaysInMonth(4, 2024);
    const { value, colDef } = params;

    if (!value || value.length === 0) {
        return null;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <SparkLineChart
                data={value}
                width={colDef.computedWidth || 100}
                height={32}
                plotType="bar"
                showHighlight
                showTooltip
                colors={['hsl(210, 98%, 42%)']}
                xAxis={{
                    scaleType: 'band',
                    data,
                }}
            />
        </div>
    );
}

const columns: GridColDef[] = [
    { field: 'pageTitle', headerName: 'Session ID', flex: 1.5, minWidth: 200 },
    {
        field: 'users',
        headerName: 'Users',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'eventCount',
        headerName: 'date',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'averageTime',
        headerName: 'Average Time',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'conversions',
        headerName: 'Daily Conversions',
        flex: 1,
        minWidth: 150,
        renderCell: renderSparklineCell,
    },
];

export const rows: GridRowsProp = [
    {
        id: 1,
        pageTitle: 'Homepage Overview',
        eventCount: 8345,
        users: 212423,
        averageTime: '2m 15s',
        conversions: [
            469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
            911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
            1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
            3296541, 3041524, 2599497,
        ],
    },
    {
        id: 2,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5653,
        users: 172240,
        averageTime: '2m 30s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 3,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5251,
        users: 1722,
        averageTime: '7m 31s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 4,
        pageTitle: 'Homepage Overview',
        eventCount: 8345,
        users: 212423,
        averageTime: '2m 15s',
        conversions: [
            469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
            911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
            1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
            3296541, 3041524, 2599497,
        ],
    },
    {
        id: 5,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5653,
        users: 172240,
        averageTime: '2m 30s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 6,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5251,
        users: 1722,
        averageTime: '7m 31s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 7,
        pageTitle: 'Homepage Overview',
        eventCount: 8345,
        users: 212423,
        averageTime: '2m 15s',
        conversions: [
            469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
            911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
            1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
            3296541, 3041524, 2599497,
        ],
    },
    {
        id: 8,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5653,
        users: 172240,
        averageTime: '2m 30s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 9,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5251,
        users: 1722,
        averageTime: '7m 31s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 10,
        pageTitle: 'Homepage Overview',
        eventCount: 8345,
        users: 212423,
        averageTime: '2m 15s',
        conversions: [
            469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
            911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
            1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
            3296541, 3041524, 2599497,
        ],
    },
    {
        id: 11,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5653,
        users: 172240,
        averageTime: '2m 30s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
    {
        id: 12,
        pageTitle: 'Product Details - Gadgets',
        eventCount: 5251,
        users: 1722,
        averageTime: '7m 31s',
        conversions: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            557488, 1341471, 2044561, 2206438,
        ],
    },
];

export default function CustomDataGrid() {
    return (
        <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
        />
    );
}
