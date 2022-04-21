// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '主页' },
    redirect: '/user/blogger',
    children: [
      // dashboard
     /* {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: 'menu.dashboard.monitor', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },*/
      // forms
     /* {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: 'menu.form', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: 'menu.form.step-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'menu.form.advanced-form', keepAlive: true, permission: ['form'] }
          }
        ]
      },*/

      // list
     /* {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
              }
            ]
          }
        ]
      },*/

      // profile
     /* {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: 'menu.profile', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: 'menu.profile.basic', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: 'menu.profile.advanced', permission: ['profile'] }
          }
        ]
      },*/

      // result
      /*{
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/!* webpackChunkName: "result" *!/ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/!* webpackChunkName: "result" *!/ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },*/

      //user
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        redirect: '/user/blogger',
        meta: { title: '用户管理', icon: 'warning'},
        children: [
          {
            path: '/user/blogger',
            name: 'BloggerList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/user/BloggerList'),
            meta: { title: '糖主管理'},
          },
          {
            path: '/user/blogger/detail',
            name: 'BloggerListDetail',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/user/BloggerDetail'),
            hidden: true,
            meta: { title: '查看详情'}
          },
          {
            path: '/user/member',
            name: 'MemberList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/user/MemberList'),
            meta: { title: '会员管理'}
          },
          {
            path: '/user/member/detail',
            name: 'MemberDetail',
            hidden: true,
            component: () => import(/* webpackChunkName: "fail" */ '@/views/user/MemberDetail'),
            meta: { title: '查看详情'}
          },
        ]
      },

      // order
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'warning'},
        children: [
          {
            path: '/order/list',
            name: 'OrderList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/order/OrderList'),
            meta: { title: '订单管理'}
          }
        ]
      },

      // content
      {
        path: '/content',
        name: 'content',
        component: RouteView,
        redirect: '/content/list',
        meta: { title: '运营管理', icon: 'warning'},
        children: [
          {
            path: '/content/list',
            name: 'ContentList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/content/ContentList'),
            meta: { title: '内容管理'}
          }
        ]
      },

      // content
      {
        path: '/sys',
        name: 'sys',
        component: RouteView,
        redirect: '/sys/log',
        meta: { title: '操作日志', icon: 'warning'},
        children: [
          {
            path: '/sys/log',
            name: 'SyslogList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/sys/LogList'),
            meta: { title: '操作日志' }
          }
        ]
      },

      // content
      {
        path: '/permission',
        name: 'permission',
        component: RouteView,
        redirect: '/permission/user',
        meta: { title: '权限管理', icon: 'warning' },
        children: [
          {
            path: '/permission/role',
            name: 'RoleList',
            component: () => import('@/views/permission/RoleList'),
            meta: { title: '角色管理', keepAlive: true }
          },
          {
            path: '/permission/user',
            name: 'UserList',
            component: () => import('@/views/permission/UserList'),
            meta: { title: '账号管理', keepAlive: true }
          },
          {
            path: '/permission/dictionary',
            name: 'dictionary',
            component: () => import('@/views/permission/dictionary'),
            meta: { title: '字典管理', keepAlive: true }
          },{
            path: '/permission/detail_1236',
            name: 'detail_1236',
            hidden: true,
            component: () => import('@/views/permission/dictionary/detail_1236'),
            meta: { title: '字典详情', keepAlive: true }
          },{
            path: '/permission/detail_4',
            name: 'detail_4',
            hidden: true,
            component: () => import('@/views/permission/dictionary/detail_4'),
            meta: { title: '字典详情', keepAlive: true }
          },{
            path: '/permission/detail_5',
            name: 'detail_5',
            hidden: true,
            component: () => import('@/views/permission/dictionary/detail_5'),
            meta: { title: '字典详情', keepAlive: true }
          },
        ]
      },

      // // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: 'menu.exception.not-find', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: 'menu.exception.server-error', permission: ['exception'] }
      //     }
      //   ]
      // },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true },
        children: [
          // {
          //   path: '/account/center',
          //   name: 'center',
          //   component: () => import('@/views/account/center'),
          //   meta: { title: 'menu.account.center', keepAlive: true, permission: ['user'] }
          // },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: '基本设置', hidden: true }
              },
              // {
              //   path: '/account/settings/security',
              //   name: 'SecuritySettings',
              //   component: () => import('@/views/account/settings/Security'),
              //   meta: {
              //     title: 'account.settings.menuMap.security',
              //     hidden: true,
              //     keepAlive: true,
              //     permission: ['user']
              //   }
              // },
              // {
              //   path: '/account/settings/custom',
              //   name: 'CustomSettings',
              //   component: () => import('@/views/account/settings/Custom'),
              //   meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
              // },
              // {
              //   path: '/account/settings/binding',
              //   name: 'BindingSettings',
              //   component: () => import('@/views/account/settings/Binding'),
              //   meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
              // },
              // {
              //   path: '/account/settings/notification',
              //   name: 'NotificationSettings',
              //   component: () => import('@/views/account/settings/Notification'),
              //   meta: {
              //     title: 'account.settings.menuMap.notification',
              //     hidden: true,
              //     keepAlive: true,
              //     permission: ['user']
              //   }
              // }
            ]
          }
        ]
      },

      // other
      // {
      //   path: '/other',
      //   name: 'otherPage',
      //   component: () => import('@/layouts/PageView'),
      //   meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
      //   redirect: '/other/icon-selector',
      //   children: [
      //     {
      //       path: '/other/icon-selector',
      //       name: 'TestIconSelect',
      //       component: () => import('@/views/other/IconSelectorView'),
      //       meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/other/list',
      //       component: RouteView,
      //       meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
      //       redirect: '/other/list/tree-list',
      //       children: [
      //         {
      //           path: '/other/list/tree-list',
      //           name: 'TreeList',
      //           component: () => import('@/views/other/TreeList'),
      //           meta: { title: '树目录表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/edit-table',
      //           name: 'EditList',
      //           component: () => import('@/views/other/TableInnerEditList'),
      //           meta: { title: '内联编辑表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/user-list',
      //           name: 'UserList',
      //           component: () => import('@/views/other/UserList'),
      //           meta: { title: '用户列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/role-list',
      //           name: 'RoleList22',
      //           component: () => import('@/views/other/RoleList'),
      //           meta: { title: '角色列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/system-role',
      //           name: 'SystemRole',
      //           component: () => import('@/views/other/RoleList'),
      //           meta: { title: '角色列表2', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/permission-list',
      //           name: 'PermissionList',
      //           component: () => import('@/views/other/PermissionList'),
      //           meta: { title: '权限列表', keepAlive: true }
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
