import React from "react"
import clsx from "clsx"
import _ from "lodash"
import { withStyles } from "@material-ui/core/styles"
import TableCell from "@material-ui/core/TableCell"
import { AutoSizer, Column, Table } from "react-virtualized"
import { spacings, radii, colors } from "../constants"

const VirtualizedTable = withStyles(({ palette, direction, shadows }) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: direction === "rtl" ? "0 !important" : undefined,

      '& [role="columnheader"]:not(:first-child)': {
        flexGrow: "1 !important",
        flexShrink: "0 !important",
      },
    },

    "& .ReactVirtualized__Table__Grid": {
      border: `1px solid ${palette.primary.main}`,
      padding: `${spacings.small} ${spacings.xSmall}`,

      "&::-webkit-scrollbar": {
        width: spacings.small,

        "&-thumb": {
          borderRadius: radii.border,
          background: palette.grey[300],
          boxShadow: `inset 0 0 0 5px ${colors.white}`,

          "&:hover": {
            backgroundColor: palette.grey[500],
          },
        },

        "&-button": {
          width: 0,
          height: 0,
          display: "none",
        },

        "&-corner": {
          backgroundColor: "transparent",
        },
      },

      "&:focus": {
        outline: "none",
      },

      "& $tableRow": {
        cursor: "pointer",
        width: "100% !important",

        "& $tableCell": {
          paddingTop: spacings.xSmall,
          paddingBottom: spacings.xSmall,

          "& .MuiIconButton-root": {
            padding: 0,
          },
        },

        "&:focus": {
          outline: "none",
        },
      },
    },
  },
  tableRow: {},
  tableRowHover: {
    "&:hover": {
      "& $tableCell": {
        backgroundColor: palette.primary.light,
      },

      '& [role="gridcell"]': {
        cursor: "pointer",
        boxShadow: `-2px 0 0 ${palette.primary.light}, ${shadows[0]}`,

        "&:first-child": {
          borderTopLeftRadius: radii.border,
          borderBottomLeftRadius: radii.border,
        },

        "&:last-child": {
          borderTopRightRadius: radii.border,
          borderBottomRightRadius: radii.border,
        },
      },
    },
  },
  tableRowSelected: {
    "& $tableCell": {
      backgroundColor: palette.primary.light,
    },

    '& [role="gridcell"]': {
      cursor: "pointer",
      boxShadow: `-2px 0 0 ${palette.primary.light}, ${shadows[0]}`,

      "&:first-child": {
        borderTopLeftRadius: radii.border,
        borderBottomLeftRadius: radii.border,
      },

      "&:last-child": {
        borderTopRightRadius: radii.border,
        borderBottomRightRadius: radii.border,
      },
    },
  },
  tableCell: {
    flex: 1,
    border: 0,
  },
  rowCell: {
    flexGrow: "1 !important",
    flexShrink: "0 !important",
  },
  noClick: {
    cursor: "initial",
  },
}))(
  ({
    classes,
    columns,
    onRowClick,
    rowCount,
    maxRows,
    selectedRowsIndexes,
    rowHeight = 50,
    headerHeight = 50,
    ...tableProps
  }) => {
    const tableHeight =
      rowHeight * (rowCount < maxRows ? rowCount : maxRows) +
      headerHeight +
      parseInt(spacings.small) * 2 // padding

    const getRowClassName = ({ index }) =>
      clsx(classes.tableRow, classes.flexContainer, {
        [classes.tableRowHover]: index !== -1 && onRowClick != null,
        [classes.tableRowSelected]: selectedRowsIndexes.includes(index),
      })

    const cellRenderer = ({ cellData, padding }) => (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        align="left"
        padding={padding}
      >
        {Boolean(cellData) ? cellData : "<empty_string>"}
      </TableCell>
    )

    const headerRenderer = ({ padding, label }) => (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align="left"
        padding={padding}
      >
        <span>{label}</span>
      </TableCell>
    )

    const handleRowClick = ({ rowData: { id } }) => onRowClick(id)

    return (
      <div style={{ width: "100%", height: tableHeight }}>
        <AutoSizer>
          {({ width, height }) => (
            <Table
              height={height}
              width={width}
              rowHeight={rowHeight}
              gridStyle={{
                direction: "inherit",
              }}
              headerHeight={headerHeight}
              className={classes.table}
              {...tableProps}
              rowCount={rowCount}
              rowClassName={getRowClassName}
              onRowClick={handleRowClick}
            >
              {columns.map(({ dataKey, ...other }) => {
                const isCheckbox = dataKey === "selectAll"
                const padding = isCheckbox ? "checkbox" : "default"

                return (
                  <Column
                    key={dataKey}
                    width={
                      isCheckbox
                        ? rowHeight
                        : (width - rowHeight) / columns.length
                    }
                    headerRenderer={(headerProps) =>
                      headerRenderer({
                        ...headerProps,
                        padding,
                      })
                    }
                    className={clsx(classes.flexContainer, {
                      [classes.rowCell]: !isCheckbox,
                    })}
                    cellRenderer={(cellProps) =>
                      cellRenderer({
                        ...cellProps,
                        padding,
                      })
                    }
                    dataKey={dataKey}
                    {...other}
                  />
                )
              })}
            </Table>
          )}
        </AutoSizer>
      </div>
    )
  }
)

export default ({ rows, columns, maxRows = 4, ...tableProps }) => (
  <VirtualizedTable
    rowCount={rows.length}
    maxRows={maxRows}
    selectedRowsIndexes={_.without(
      rows.map(({ isItemSelected }, index) => (isItemSelected ? index : null)),
      null
    )}
    rowGetter={({ index }) => rows[index]}
    columns={columns}
    {...tableProps}
  />
)
