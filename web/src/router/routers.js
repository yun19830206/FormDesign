import Main from '@/components/main'
// import parentView from '@/components/parent-view'
// import axios from 'axios'
import { getListData } from '../api/data'
import dada from '@/view/update/update-table.vue'
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
console.log(dada, 'llllllllllllll')
let routerArr = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
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
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/define_form',
    name: 'define_form',
    meta: {
      icon: 'md-cloud-upload',
      title: '定义表单'
    },
    component: Main,
    children: [
      {
        path: 'my_define_form',
        name: 'my_define_form',
        meta: {
          icon: 'ios-document',
          title: '我定义表单'
        },
        component: () => import('@/view/defineForm/my_define_form.vue')
      },
      {
        path: 'new_define_form',
        name: 'new_define_form',
        meta: {
          icon: 'md-clipboard',
          title: '新定义表单'
        },
        component: () => import('@//view/defineForm/new_define_form.vue')
      }
    ]
  },
  {
    path: '/form_data',
    name: 'form_data',
    meta: {
      icon: 'md-cloud-upload',
      title: '表单数据'
    },
    component: Main,
    
  },
  {
    path: '/business_customization',
    name: 'business_customization',
    meta: {
      icon: 'md-cloud-upload',
      title: '业务定制功能'
    },
    component: Main,
    children: [
      {
        path: 'customization1',
        name: 'customization1',
        meta: {
          icon: 'ios-document',
          title: '定制功能1'
        },
        component: () => import('@/view/update/update-table.vue')
      },
      {
        path: 'customization2',
        name: 'customization2',
        meta: {
          icon: 'md-clipboard',
          title: '定制功能2'
        },
        component: () => import('@/view/update/update-paste.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

getListData().then((res) => {
  console.log(res.data, '-----------')
  let childArr = [];
  //{
  //         path: 'my_define_form',
  //         name: 'my_define_form',
  //         meta: {
  //           icon: 'ios-document',
  //           title: '我定义表单'
  //         },
  //         component: () => import('@/view/defineForm/my_define_form.vue')
  //       },
  //       {
  //         path: 'new_define_form',
  //         name: 'new_define_form',
  //         meta: {
  //           icon: 'md-clipboard',
  //           title: '新定义表单'
  //         },
  //         component: () => import('@//view/defineForm/new_define_form.vue')
  //       }
  res.data.data.forEach((val) => {
    let childObj = {}
    childObj.path = val.englishName;
    childObj.name = routerArr[3].children[0].name;
    childObj.meta = {
      icon: 'iii',
      title: val.chineseName
    }
    childObj.component = () => import('@/view/defineForm/my_define_form.vue')
    childArr.push(childObj)
  })
  // routerArr[3].children = childArr
  // routerArr[4].children.splice(0,1)
})
console.log(routerArr)
export default routerArr
