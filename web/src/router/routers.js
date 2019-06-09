import Main from '@/components/main'
// import parentView from '@/components/parent-view'
// import axios from 'axios'
// import { getListData } from '../api/data'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
let routerArr = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    // component: () => import('@/view/login/login.vue')
    component (resolve) {
      require(['@/view/login/login.vue'], resolve)
    }
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        // component: () => import('@/view/single-page/home')
        component (resolve) {
          require(['@/view/single-page/home'], resolve)
        }
      }
    ]
  },
  {
    path: '/define_form',
    name: 'define_form',
    meta: {
      icon: 'logo-buffer',
      title: '定义表单'
    },
    component: Main,
    children: [
      {
        path: 'my_define_form',
        name: 'my_define_form',
        meta: {
          icon: 'md-list-box',
          title: '我定义表单'
        },
        // component: () => import('@/view/defineForm/my_define_form.vue')
        component (resolve) {
          require(['@/view/defineForm/my_define_form.vue'], resolve)
        }
      },
      {
        path: 'new_define_form',
        name: 'new_define_form',
        meta: {
          icon: 'md-clipboard',
          title: '新定义表单'
        },
        // component: () => import('@//view/defineForm/new_define_form.vue')
        component (resolve) {
          require(['@/view/defineForm/new_define_form.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/form_data',
    name: 'form_data',
    meta: {
      icon: 'md-list-box',
      title: '表单数据111'
    },
    component: Main,
    children: [
      {
        path: 'form_data_child',
        name: 'form_data_child',
        meta: {
          title: '表单页面',
          icon: 'ios-list-box'
        },
        // component: () => import('@/view/formData/data_form_child.vue')
        component (resolve) {
          require(['@/view/formData/data_form_child.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/business_customization',
    name: 'business_customization',
    meta: {
      icon: 'ios-calendar',
      title: '业务定制功能'
    },
    component: Main,
    children: [
      {
        path: 'CRMCustomerManage',
        name: 'CRMCustomerManage',
        meta: {
          icon: 'md-contacts',
          title: 'CRM客户管理'
        },
        component (resolve) {
          require(['@/view/customMade/crm-customer-manage.vue'], resolve)
        }
      },
      {
        path: 'CRMCustomerManageDetail/:customerId/:formId',
        name: 'CRMCustomerManageDetail',
        meta: {
          hideInMenu: true,
          title: 'CRM客户管理详情'
        },
        component (resolve) {
          require(['@/view/customMade/crm-customer-manage-detail.vue'], resolve)
        }
      },
      {
        path: 'customization2',
        name: 'customization2',
        meta: {
          icon: 'ios-cog',
          title: '定制功能2'
        },
        // component: () => import('@/view/update/update-paste.vue')
        component (resolve) {
          require(['@/view/update/update-paste.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/401.vue')
    component (resolve) {
      require(['@/view/error-page/401.vue'], resolve)
    }
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/500.vue')
    component (resolve) {
      require(['@/view/error-page/500.vue'], resolve)
    }
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/404.vue')
    component (resolve) {
      require(['@/view/error-page/404.vue'], resolve)
    }
  },

  {
    path: '/wechat_login',
    name: 'wechat_login',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_login.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_login.vue'], resolve)
    }
  },
  {
    path: '/wechat_form',
    name: 'wechat_form',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_form.vue'], resolve)
    }
  },
  {
    path: '/wechat_form_display/:id',
    name: 'wechat_form_display',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form_display.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_form_display.vue'], resolve)
    }
  },
  {
    path: '/wechat_form_add/:id',
    name: 'wechat_form_add',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form_add.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_form_add.vue'], resolve)
    }
  },
  {
    path: '/wechat_form_edit/:tid/:id',
    name: 'wechat_form_edit',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form_add.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_form_edit.vue'], resolve)
    }
  },
  {
    path: '/wechat_form_crm_customer',
    name: 'wechat_form_crm_customer',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form_add.vue')
    component (resolve) {
      require(['@/view/wechat/wechat_form_crm_customer.vue'], resolve)
    }
  },
  {
    path: '/wechat_form_crm_customer_detail/:customerId',
    name: 'wechat_form_crm_customer_detail',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/wechat/wechat_form_add.vue')
    component (resolve) {
      require(['@/view/customMade/crm-customer-manage-detail.vue'], resolve)
    }
  }

]

export default routerArr
