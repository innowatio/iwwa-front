import React, {PropTypes} from "react";
import {
    Col,
    Row
} from "react-bootstrap";
import R from "ramda";

import {
    CancelConfirmationModal,
    FullscreenModal
} from "components";
import {defaultTheme} from "lib/theme";

import SearchPanel from "./search-panel";
import Collection from "./collection";
import DropArea from "./drop-area";

const stylesFunction = ({colors}) => ({
    modalTitleStyle: {
        color: colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    }
});

var SearchableDraggableModal = React.createClass({
    propTypes: {
        collection: PropTypes.array.isRequired,
        initialsItems: PropTypes.array,
        onConfirm: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        searchFields: PropTypes.array.isRequired,
        show: PropTypes.bool.isRequired,
        title: PropTypes.string
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            droppedItems: [],
            selectedItems: [],
            showConfirmModal: false,
            searchFilters: [],
            searchKeywords: []
        };
    },
    componentWillReceiveProps: function () {
        const {initialsItems} = this.props || [];
        this.setState({
            droppedItems: initialsItems
        });
    },
    getItems: function () {
        const {collection} = this.props;
        const {searchFilters} = this.state;
        const mappedFilters = searchFilters.map((filter) => {
            return collection.filter(x => String(x[filter.filter]).toLowerCase().includes(filter.value.toLowerCase()));
        });
        const items = R.intersection(...mappedFilters, R.uniq(collection), collection.filter(x => x));
        return items.map(item => {
            return {
                ...item,
                selected: this.state.selectedItems.find(x => x.id === item.id) ? true : false
            };
        });
    },
    getItemsDropped: function () {
        return R.uniq(this.state.droppedItems.map(x => {
            return {
                id: x.id
            };
        }));
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    onHide: function () {
        const {onHide} = this.props;
        this.setState({
            showConfirmModal: false
        });
        onHide();
    },
    renderTitle: function () {
        const {title} = this.props;
        return (
            <div style={{textAlign: "center"}}>
                <label style={stylesFunction(this.getTheme()).modalTitleStyle}>
                    {title ? title.toUpperCase() : "Selezione dati:".toUpperCase()}
                </label>
            </div>
        );
    },
    render: function () {
        const {
            onConfirm,
            searchFields,
            show,
            title
        } = this.props;
        return (
            <div>
                <FullscreenModal
                    show={show}
                    onHide={() => {
                        this.setState({
                            showConfirmModal: true
                        });
                    }}
                    title={title}
                >
                    <Row>
                        <Col md={3}>
                            <SearchPanel
                                onAddFilter={(filter) => {
                                    this.setState({
                                        searchFilters: [...this.state.searchFilters, filter]
                                    });
                                }}
                                onConfirm={() => {
                                    onConfirm(this.state.droppedItems);
                                    this.replaceState(this.getInitialState());
                                }}
                                onReset={() => {
                                    this.setState({
                                        searchFilters: []
                                    });
                                }}
                                searchFields={searchFields}
                                searchFilters={this.state.searchFilters.map(x => `${x.filter}:${x.value}`)}
                            />
                        </Col>
                        <Col md={9}>
                            <Collection
                                items={this.getItems()}
                                onItemClicked={(item) => {
                                    if (item.selected) {
                                        this.setState({
                                            selectedItems: this.state.selectedItems.filter(x => x.id != item.id)
                                        });
                                    } else {
                                        this.setState({
                                            selectedItems: [...this.state.selectedItems, item]
                                        });
                                    }
                                }}
                                onSelectAllItems={() => {
                                    this.setState({
                                        selectedItems: this.getItems().map(item => {
                                            return {
                                                ...item,
                                                selected: true
                                            };
                                        })
                                    });
                                }}
                                onSelectedItemsMove={() => {
                                    this.setState({
                                        droppedItems: R.uniq([...this.state.droppedItems, ...this.state.selectedItems])
                                    });
                                }}
                            />
                            <DropArea
                                droppedItems={this.getItemsDropped()}
                                onItemDropped={(item) => {
                                    this.setState({
                                        droppedItems: R.uniq([
                                            ...this.state.droppedItems,
                                            item
                                        ])
                                    });
                                }}
                                onItemRemoved={(item) => {
                                    this.setState({
                                        droppedItems: this.state.droppedItems.filter(x => x.id != item.id)
                                    });
                                }}
                            />
                        </Col>
                    </Row>
                </FullscreenModal>
                <CancelConfirmationModal
                    show={this.state.showConfirmModal}
                    onConfirm={this.onHide}
                    onHide={() => this.setState({
                        showConfirmModal: false
                    })}
                />
            </div>
        );
    }
});

module.exports = SearchableDraggableModal;
