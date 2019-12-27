import React, { Component, Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { findRole } from './../../custom/CusFunction';
import * as roles from './../../contants/roles';

const MyLink = ({ children, nativeClass, ...linkProps }) => (
    <Route
        path={linkProps.to}
        exact={linkProps.activeOnlyWhenExact}
        children={({ match }) => (
            <li className={nativeClass + (match ? ' active' : '') + (nativeClass && match ? ' menu-open' : '')}>
                <Link to={linkProps.to}>{linkProps.label}</Link>
                {children}
            </li>
        )}
    />
);

class Sidebar extends Component {

    render() {
        let { user } = this.props;
        let add = findRole(user.role, roles.ADD) !== -1;
        return (
            <aside className="main-sidebar">
                {/* sidebar: style can be found in sidebar.less */}
                <section className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src="/static/images/admin.png" className="img-circle" alt="User Image" />
                        </div>
                        <div className="pull-left info">
                            <p>{user.fullName}</p>
                            {/* Status */}
                            <a href="#"><i className="fa fa-circle text-success" /> Online</a>
                        </div>
                    </div>
                    {/* search form (Optional) */}
                    <form action="#" method="get" className="sidebar-form">
                        <div className="input-group">
                            <input type="text" name="q" className="form-control" placeholder="Search..." />
                            <span className="input-group-btn">
                                <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search" />
                                </button>
                            </span>
                        </div>
                    </form>
                    {/* /.search form */}
                    {/* Sidebar Menu */}
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="header">HEADER</li>
                        {/* Optionally, you can add icons to the links */}
                        <MyLink
                            to="/sector"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-globe" /> <span>Sector</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        nativeClass=""
                                        to="/sector/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Sector
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            nativeClass=""
                                            to="/sector/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Sector
                                        </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/province"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-map-marker" /> <span>Province</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/province/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Province
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/province/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Province
                                        </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/school"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-graduation-cap " /> <span>School</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/school/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List School
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/school/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add School
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/mark"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-diamond" /> <span>Mark</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/mark/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Mark
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/mark/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Mark
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/major"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-grav" /> <span>Major</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/major/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Major
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/major/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Major
                                                </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/subject"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-book" /> <span>Subject</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/subject/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Subject
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/subject/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Subject
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/subjectGroup"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-navicon" /> <span>SubjectGroup</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/subjectGroup/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List SubjectGroup
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/subjectGroup/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add SubjectGroup
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        {findRole(user.role, roles.ROOT) !== -1 &&
                            <Fragment>
                                <MyLink
                                    to="/role"
                                    activeOnlyWhenExact={false}
                                    nativeClass="treeview"
                                    label={
                                        <Fragment>
                                            <i className="fa fa-shield" /> <span>Role</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </Fragment>
                                    }
                                >
                                    {
                                        <ul className="treeview-menu">
                                            <MyLink
                                                to="/role/list"
                                                activeOnlyWhenExact={true}
                                                label={
                                                    <Fragment>
                                                        <i className="fa fa-circle-o"></i> List Role
                                            </Fragment>
                                                }
                                            />
                                            <MyLink
                                                to="/role/add"
                                                activeOnlyWhenExact={true}
                                                label={
                                                    <Fragment>
                                                        <i className="fa fa-circle-o"></i> Add Role
                                            </Fragment>
                                                }
                                            />
                                        </ul>
                                    }
                                </MyLink>
                                <MyLink
                                    to="/user"
                                    activeOnlyWhenExact={false}
                                    nativeClass="treeview"
                                    label={
                                        <Fragment>
                                            <i className="fa fa-users" /> <span>User</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </Fragment>
                                    }
                                >
                                    {
                                        <ul className="treeview-menu">
                                            <MyLink
                                                to="/user/list"
                                                activeOnlyWhenExact={true}
                                                label={
                                                    <Fragment>
                                                        <i className="fa fa-circle-o"></i> List User
                                            </Fragment>
                                                }
                                            />
                                            <MyLink
                                                to="/user/add"
                                                activeOnlyWhenExact={true}
                                                label={
                                                    <Fragment>
                                                        <i className="fa fa-circle-o"></i> Add User
                                            </Fragment>
                                                }
                                            />
                                        </ul>
                                    }
                                </MyLink>
                            </Fragment>
                        }
                        <MyLink
                            to="/new"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-navicon" /> <span>New</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/new/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List New
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/new/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add New
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        <MyLink
                            to="/media"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-navicon" /> <span>Media</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/media/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List New
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/media/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add New
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink>
                        {/* <MyLink
                            to="/job"
                            activeOnlyWhenExact={false}
                            nativeClass="treeview"
                            label={
                                <Fragment>
                                    <i className="fa fa-navicon" /> <span>Job</span>
                                    <span className="pull-right-container">
                                        <i className="fa fa-angle-left pull-right" />
                                    </span>
                                </Fragment>
                            }
                        >
                            {
                                <ul className="treeview-menu">
                                    <MyLink
                                        to="/job/list"
                                        activeOnlyWhenExact={true}
                                        label={
                                            <Fragment>
                                                <i className="fa fa-circle-o"></i> List Job
                                            </Fragment>
                                        }
                                    />
                                    {add &&
                                        <MyLink
                                            to="/job/add"
                                            activeOnlyWhenExact={true}
                                            label={
                                                <Fragment>
                                                    <i className="fa fa-circle-o"></i> Add Job
                                            </Fragment>
                                            }
                                        />
                                    }
                                </ul>
                            }
                        </MyLink> */}
                    </ul>
                    {/* /.sidebar-menu */}
                </section>
                {/* /.sidebar */}
            </aside>
        );
    }
}

export default Sidebar;