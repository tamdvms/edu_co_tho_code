import React, { Component, Fragment } from 'react';
import NewApi from '../../api/NewApi';
import { connect } from 'react-redux';
import * as actions from '../../actions/NewActions';
import toastr from 'toastr';
import Select from 'react-select';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';
import MediaApi from '../../api/MediaApi';
import * as mediaActions from './../../actions/MediaActions';

class EditNew extends Component {

    constructor(props) {
        super(props);

        this.init = {
            myNew: {
                id: undefined,
                status: '',
                description: '',
                content: '',
                title: '',
                image: ''
            },
            statusSelectedOption: null,
            isProcess: false
        }

        this.state = {
            isUpdate: false,
            statusOptions: [],
            ...this.init,

            invalid: false,

            editor: undefined,

            file: undefined,

            medias: [],
            page: 1,
            next: false
        }
        toastr.options = toastrOption;
    }

    async componentDidMount() {
        CKEDITOR.replace('editor', {
            extraPlugins: ['mediaUpload', 'image2']
        });
        let editor = CKEDITOR.instances.editor;
        editor.addCommand('mediaUpload', {
            exec: function (editor) {
                $('#mediaUpload').modal('toggle');
            }
        });
        this.setState({ editor });
        this.props.changeLoading(true);
        await this.updateAction(this.props);
        this.props.changeLoading(false);
        this.loadMedias(1);
    }

    componentWillReceiveProps(nextProps) {
        this.updateAction(nextProps);
        let { medias, next } = nextProps.data;
        if (this.props.medias !== medias) {
            this.setState({ medias, next });
        }
    }

    loadStatusOption = async () => {
        // lấy tất cả status trong db
        let next = true, rs = [], tmp, page = 1;
        while (next) {
            tmp = await StatusApi.getAll({
                page: page++,
                session: this.props.session
            });
            rs = rs.concat(tmp.body.data.list);
            next = tmp.body.data.next;
        }
        this.setState({
            statusOptions: rs.map(el => ({ value: el.id, label: el.name }))
        });
    }

    updateAction = async (props) => {
        let isUpdate = props.do === 'update' ? true : false;
        this.setState({ isUpdate });
        await this.loadStatusOption();
        if (isUpdate) {
            let res = await NewApi.getOne({ id: props.match.params.id, session: this.props.session });
            let myNew = res.body.data;
            myNew.status = myNew.status.id;
            if (myNew) {
                this.state.editor.setData(myNew.content);
                this.setState({
                    myNew,
                    statusSelectedOption: this.state.statusOptions.filter(el => el.value === myNew.status),
                });
            }
        } else {
            this.renewForm();
        }
    }

    renewForm = () => {
        let { statusOptions } = this.state;
        this.setState(preState => ({
            ...preState,
            ...this.init,
            myNew: {
                ...preState.myNew,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            myNew: {
                ...preState.myNew,
                [name]: value
            }
        }));
    }

    handleSave = (e) => {
        e.preventDefault();
        this.setState({
            isProcess: true
        });
        let invalid = this.checkInput();
        if (invalid) {
            this.setState({ isProcess: false, invalid });
            return;
        }
        let { myNew } = this.state;
        myNew.content = this.state.editor.getData();
        if (myNew.id) {
            this.props.updateNew(myNew).then(code => {
                if (code === 200) {
                    toastr.success('Updated!');
                } else {
                    toastr.error('Error! ' + code);
                }
                this.setState({
                    isProcess: false
                });
            });
        } else {
            this.props.addNew(myNew).then(code => {
                if (code === 200) {
                    toastr.success('Added!');
                } else {
                    toastr.error('Error! ' + code);
                }
                this.setState({
                    isProcess: false
                });
                this.renewForm();
            });
        }
    }

    handleSaveFile = file => {
        if (file) {
            this.setState({ isProcess: true });
            MediaApi.upload(file).then(res => {
                if (res.body.code === 200) {
                    toastr.success('Đã upload: ' + file.name);
                } else {
                    toastr.error('Có lỗi xảy ra vui lòng thử lại!');
                }
                this.setState({ isProcess: false });
            }).catch(error => {
                this.setState({ isProcess: false });
            });
        }
    }

    handleChangeFile = e => {
        this.handleSaveFile(e.target.files[0]);
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { myNew } = this.state;
        myNew.status = statusSelectedOption.value
        this.setState({
            myNew
        });
    }

    checkInput = () => {
        let { myNew } = this.state;
        // kiểm tính hợp lệ của các trường input (tạm thời chưa xử lí)
        return false;
    }

    handleDrop = e => {
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < e.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (e.dataTransfer.items[i].kind === 'file') {
                    let file = e.dataTransfer.items[i].getAsFile();
                    this.handleSaveFile(file);
                }
            }
            this.loadMedias(1);
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                // console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
            }
        }

        // Pass event to removeDragData for cleanup
        this.removeDragData(e);
    }

    removeDragData = e => {
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            e.dataTransfer.items.clear();
        } else {
            // Use DataTransfer interface to remove the drag data
            e.dataTransfer.clearData();
        }
    }

    handleDragOver = e => {
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
    }

    genListMedia = () => {
        let { medias } = this.state;
        let rs = undefined;
        if (medias) {
            rs = medias.map((media, index) => (
                <div key={index} className="col-xs-12 col-lg-2 mb-30">
                    <div
                        className="box-mediaUpload"
                        style={{ backgroundImage: 'url("' + media.link + '")' }}
                        onClick={() => this.insertImage(media.link)}
                    ></div>
                </div>
            ));
        }
        return rs;
    }

    newPage = (e, num) => {
        e.preventDefault();
        let { page, next } = this.state;
        page += num;
        if (page === 0 || (!next && num > 0)) {
            return;
        } else {
            this.setState({ page });
            this.loadMedias(page);
        }
    }

    insertImage = link => {
        $('#mediaUpload').modal('toggle');
        this.state.editor.insertHtml('<img style="max-width: 100%" src="' + link + '" />');
    }

    loadMedias = page => {
        let status = this.state.statusOptions.find(el => el.label === 'active').value;
        this.props.loadMedias(page, status);
    }

    render() {
        let { myNew } = this.state;
        return (
            <Fragment>
                <div id="mediaUpload" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div>
                                <div className="modal-header text-center">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                    <h4 className="modal-title">Media image upload</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <input
                                                id="upload" type="file"
                                                name="file" onChange={this.handleChangeFile}
                                                style={{ display: 'none' }}
                                            />
                                            <div
                                                className="col-xs-12 col-lg-6 col-lg-offset-3 drop_zone"
                                                onDrop={this.handleDrop}
                                                onDragOver={this.handleDragOver}
                                                onClick={() => $('#upload').click()}
                                            >
                                                <i className="fa fa-5x fa-cloud-upload"></i>
                                                <h3>Bấm để chọn ảnh/kéo thả ảnh vào đây</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{ borderBottom: '1px solid #f4f4f4', margin: '20px 0px' }}>
                                    </div>
                                    <div className="row">
                                        {this.genListMedia()}
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 clear-fix">
                                            <ul className="pagination pagination-md no-margin pull-right">
                                                <li className={this.state.page === 1 ? 'disabled' : ''}>
                                                    <a href="#" onClick={(e) => this.newPage(e, -1)}>Pre</a>
                                                </li>
                                                <li className="active">
                                                    <a>{this.state.page}</a>
                                                </li>
                                                <li className={this.state.next ? '' : 'disabled'}>
                                                    <a href="#" onClick={(e) => this.newPage(e, 1)} >Next</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý Bài Viết
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> New</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' bài viết'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="aspiration">Title</label>
                                                <input
                                                    value={myNew.title}
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="title"
                                                    name="title"
                                                    placeholder="Title"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="aspiration">Description</label>
                                                <input
                                                    value={myNew.description}
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Description"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="aspiration">Hình ảnh</label>
                                                <input
                                                    value={myNew.image}
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="image"
                                                    name="image"
                                                    placeholder="Hình ảnh"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng thái (*)</label>
                                                <Select
                                                    styles={selectStyle}
                                                    onChange={this.handleChangeStatus}
                                                    options={this.state.statusOptions}
                                                    value={this.state.statusSelectedOption}
                                                    placeholder="Trạng thái (*)"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="aspiration">Nội dung</label>
                                                <textarea name="content" id="editor"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-6 col-md-3 col-xs-offset-6 col-md-offset-9">
                                            <button
                                                className="btn btn-block btn-primary btn-flat"
                                                onClick={(e) => this.handleSave(e)}
                                                disabled={this.state.isProcess}
                                            >
                                                Lưu lại  {this.state.isProcess ? (<i className="fa fa-spinner faa-spin animated"></i>) : ''}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- /.box-body --> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* /.content */}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session,
        data: state.MediaReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addNew: myNew => dispatch(actions.addNewApi(myNew)),
        updateNew: myNew => dispatch(actions.updateNewApi(myNew)),
        changeLoading: loading => dispatch(changeLoading(loading)),
        loadMedias: (page, statusFilter) => dispatch(mediaActions.loadListApi(page, undefined, statusFilter)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditNew);