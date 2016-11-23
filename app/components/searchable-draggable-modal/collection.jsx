import React, {PropTypes} from "react";
import {List} from "react-virtualized";

import {
    Button
} from "components";

import DraggableItem from "./draggable-item";

var Collection = React.createClass({
    propTypes: {
        items: PropTypes.array.isRequired,
        onItemClicked: PropTypes.func.isRequired,
        onSelectAllItems: PropTypes.func.isRequired,
        onSelectedItemsMove: PropTypes.func.isRequired
    },
    rowRenderer: function ({key, index, style}) {
        const {
            items,
            onItemClicked
        } = this.props;
        return (
            <div
                key={key}
                style={style}
            >
                <DraggableItem
                    index={index}
                    item={items[index]}
                    label={items[index].id}
                    onClick={onItemClicked}
                />
            </div>
        );
    },
    render: function () {
        const {
            items,
            onSelectAllItems,
            onSelectedItemsMove
        } = this.props;
        return (
            <div>
                <List
                    width={1200}
                    height={450}
                    rowCount={items.length}
                    rowHeight={50}
                    rowRenderer={this.rowRenderer}
                    selectedItems={items.filter(x => x.selected === true).length}
                />
                <Button
                    onClick={onSelectAllItems}
                    style={{
                        color: "white",
                        borderRadius: "30px",
                        fontWeight: "300",
                        height: "45px",
                        lineHeight: "45px",
                        paddingTop: "0px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: "#ec4882"
                    }}
                >
                    {"SELEZIONA TUTTI"}
                </Button>
                <Button
                    onClick={onSelectedItemsMove}
                    style={{
                        color: "white",
                        borderRadius: "30px",
                        fontWeight: "300",
                        height: "45px",
                        lineHeight: "45px",
                        paddingTop: "0px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: "#ec4882"
                    }}
                >
                    {"SPOSTA SELEZIONATI"}
                </Button>
            </div>
        );
    }
});

module.exports = Collection;
