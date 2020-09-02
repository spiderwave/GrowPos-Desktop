import React, { createContext, Component } from 'react';
import { connect } from 'react-redux'
import { ReadData, LoadStart, LoadSucsess, LoadFail } from '../store/action/DataStore'
import { SyncDb, SyncDbReset, isSyncStart, isSyncDone } from '../store/action/syncAction'
import TurtleDB from 'turtledb';
import { ReadShop, UserData} from '../store/action/Shop'


let context = null;
const { Provider, Consumer } = context = createContext()

class DataProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Sync: false,
            items: [],
            BulkLodding: false
        }
        this.db = new TurtleDB('Data');
        this.db.setRemote('http://localhost:4040')
        this.addItem = this.addItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.syncData = this.syncData.bind(this);
        this.loadAllData = this.loadAllData.bind(this);
        this.toggleSync = this.toggleSync.bind(this);
        this.BulkAdd = this.BulkAdd.bind(this);
    }
    componentDidMount() {
        this.loadAllData();

    }
    loadAllData() {
        const loadData = () => {
            return new Promise((resolve, reject) => {
                this.db.readAll()
                    .then((Data) => {
                        this.setState({ items: Data });
                        const Source = Data.filter((item) => item.dbName === 'Source')
                        this.props.ReadData('Source', Source)
                        const Category = Data.filter((item) => item.dbName === 'Category')
                        this.props.ReadData('Category', Category)
                        const Tax = Data.filter((item) => item.dbName === 'Tax')
                        this.props.ReadData('Tax', Tax)
                        const Tables = Data.filter((item) => item.dbName === 'Tables')
                        this.props.ReadData('Tables', Tables)
                        const Products = Data.filter((item) => item.dbName === 'Products')
                        this.props.ReadData('Products', Products)
                        const Shop = Data.filter((item) => item.dbName === 'Shop')
                        this.props.ReadShop(Shop)
                        const CurrentUser = Data.filter((item) => item.dbName === 'CurrentUser')
                        this.props.UserData(CurrentUser)
                        resolve('load done')
                    })
                    .catch((err) => {
                        reject(err)
                    });

            })
        }
        this.props.LoadStart()
        loadData()
            .then((sucsess) => {
                this.props.LoadSucsess()
            })
            .catch((err) => {
                console.log('Error:', err)
                this.props.LoadFail()
            });
    }

    addItem(name, Data) {
        return new Promise((resolve, reject) => {
            const updatedItems = [...this.state.items];
            const newItem = Object.assign(Data, { isSync: false, dbName: name })
            this.db.create(newItem)
                .then((Data) => {
                    updatedItems.push(Data);
                    this.setState({ items: updatedItems })
                    this.props.SyncDb('AddItem')
                    this.loadAllData()
                    resolve(`Add ${name} Done! `)
                })
                .catch((err) => {
                    console.log('Error:', err)
                    reject(err)
                });

        })
    }
    BulkAdd(name, arr) {
        this.setState({BulkLodding: true})
        return new Promise((resolve, reject) => {
            let updatedItems = [...this.state.items];
            const updateData = (Data) => {
                const newItem = Object.assign(Data, { isSync: false, dbName: name })
                return new Promise((resolve, reject) => {
                    this.db.create(newItem)
                        .then((Data) => {
                            updatedItems.push(Data);
                            this.props.SyncDb('AddItem')
                            resolve(`Add ${name} Done! `)
                        })
                        .catch((err) => {
                            console.log('Error:', err)
                            reject(err)
                        });

                })

            }
            const filterLoop = () => {
                return new Promise((resolve, reject) => {
                    if (arr.length !== 0) {
                        try {
                            arr.forEach(element => {
                                updateData(element).then((d) => {
                                    resolve(d)
                                })
                            });
                        } catch (error) {
                            reject(error)
                        }
                    } else {
                        resolve('error')
                    }
                })
            }
            filterLoop()
                .then((d) => {
                    this.setState({ items: updatedItems , BulkLodding: false })
                    this.loadAllData()
                    resolve(d)
                })
                .catch((err) => {
                    this.setState({BulkLodding: false})
                    reject(err)
                });
        })
    }
    editItem(_id, editItem) {
        let updatedItems;
        const oldItems = this.state.items;
        const oldItem = oldItems.find(item => item._id === _id);
        const newItem = Object.assign(oldItem, editItem);
        this.db.update(_id, newItem)
            .then((updatedData) => {
                updatedItems = oldItems.filter(item => item._id === _id ? updatedData : item);
                this.setState({ items: updatedItems });
                this.loadAllData()
            })
            .catch((err) => console.log('Error:', err));
    }
    toggleSync() {
        return new Promise((resolve, reject) => {
            let updatedItems
            const updateData = (_id) => {
                return new Promise((resolve, reject) => {
                    const oldItems = this.state.items;
                    const oldItem = oldItems.find(item => item._id === _id);
                    const newItem = Object.assign(oldItem, { isSync: true });
                    this.db.update(_id, newItem)
                        .then((updatedTodo) => {
                            updatedItems = oldItems.filter(item => item._id === _id ? updatedTodo : item);
                            resolve(updatedItems)
                        })
                        .catch((err) => {
                            console.log('Error:', err)
                            reject(reject)
                        });
                })

            }
            const filterLoop = () => {
                return new Promise((resolve, reject) => {
                    let filter = this.state.items.filter(item => item.isSync === false)
                    if (filter.length !== 0) {
                        try {
                            filter.forEach(element => {
                                updateData(element._id).then((d) => {
                                    resolve(d)
                                })
                            });
                        } catch (error) {
                            reject(error)
                        }
                    } else {
                        resolve('Sync Type Delete only!')
                    }
                })
            }
            filterLoop()
                .then((d) => {
                    this.setState({ items: updatedItems });
                    resolve(d)
                })
                .catch((err) => {
                    reject(err)
                });
        })
    }
    deleteItem(_id) {
        return new Promise((resolve, reject) => {
            this.db.delete(_id)
                .then(() => {
                    let updatedItems = [...this.state.items].filter(item => item._id !== _id)
                    this.setState({ items: updatedItems });
                    this.props.SyncDb('DeleteItem')
                    this.loadAllData()
                    resolve('Delete Done')
                })
                .catch((err) => {
                    console.log('Error:', err)
                    reject(err)
                });
        })
    }

    syncData() {
        return new Promise((resolve, reject) => {
            const { Sync } = this.props.sync
            if (Sync === false) {
                this.loadAllData()
                this.props.isSyncStart()
                this.db.sync()
                    .then(() => {
                        this.toggleSync()
                            .then((d) => {
                                this.props.isSyncDone()
                                this.props.SyncDbReset()
                                this.loadAllData()
                                resolve('Sync Sucsess')
                            })
                    })
            } else {
                reject('Sync Alredy Running..')
            }
        })

    }
    render() {
        return (
            <Provider
                value={{
                    ...this.props.data,
                    ...this.state,
                    addItem: this.addItem,
                    loadAllData: this.loadAllData,
                    deleteItem: this.deleteItem,
                    syncData: this.syncData,
                    BulkAdd: this.BulkAdd
                }}
            >
                <>
                    {this.props.children}
                </>
            </Provider>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.DataStore,
        sync: state.SyncData,
    }
}


export { Consumer as DataConsumer, context as DataContext }

export default connect(mapStateToProps, {
    ReadData,
    LoadStart,
    LoadSucsess,
    LoadFail,
    SyncDb,
    SyncDbReset,
    isSyncStart,
    isSyncDone,
    ReadShop,
    UserData
})(DataProvider) 