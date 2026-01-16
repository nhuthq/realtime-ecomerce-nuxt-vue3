<script setup>
import 'primeicons/primeicons.css'
import UserIcon from "../assets/icons/UserIcon.vue";
import PaymentIcon from "../assets/icons/PaymentIcon.vue";
import ProductIcon from "../assets/icons/ProductIcon.vue";
import CategoryIcon from "../assets/icons/CategoryIcon.vue";
import DashboardIcon from "../assets/icons/DashboardIcon.vue";

import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { userCookieSettings } from "@/utils/user-cookie-settings";

const useCookies = useCookie("user", userCookieSettings);

const isShowMenu = ref(false);
const isDrawerOpen = ref(true);

const links = ref([
  {
    menu: "Dashboard",
    icon: DashboardIcon,
    link: "/admin/dashboard",
  },
  {
    menu: "Categories",
    icon: CategoryIcon,
    link: "/admin/categories",
  },
  {
    menu: "Products",
    icon: ProductIcon,
    link: "/admin/products",
  },
  {
    menu: "Payments",
    icon: PaymentIcon,
    link: "/admin/payments",
  },
  {
    menu: "Users",
    icon: UserIcon,
    link: "/admin/users",
  },
]);

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function toggleShowMenu() {
  isShowMenu.value = !isShowMenu.value;
}

</script>

<template>
  <div class="flex bg-white h-screen w-screen">
    <!--Left Drawer -->
    <aside :class="['bg-white shadow-lg h-full transition-all duration-300 flex flex-col', isDrawerOpen ? 'w-59' : 'w-20']">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <span v-if="isDrawerOpen" class="text-xl font-bold">Dashboard</span>
        <button class="p-2 w-10 h-10 rounded-full hover:bg-gray-200" @click="toggleDrawer">
          <span v-if="isDrawerOpen" class="pi pi-times"></span>
          <span v-else class="pi pi-bars"></span>
        
        </button>
      </div>
      <nav class="flex-1 mt-4 space-y-2">
        <nuxt-link
        v-for="menu in links"
        :key="menu"
        :to="menu.link"
        href="#"
        class="flex items-center justify-start gap-4 px-4 py-2 text-gray-700 hover:bg-gray-200">
          <component :is="menu.icon" />
          <span v-if="isDrawerOpen">{{ menu.menu }}</span>
        </nuxt-link>
      </nav>
    </aside>
    
    <!--Main Content -->
    <div class="flex flex-1 flex-col">
      <header class="bg-white shadow px-8 py-4 flex items-center justify-between">
        <h1 class="text-lg font-semibold">Welcome Back!</h1>
        <div class="relative" @click="toggleShowMenu">
          <img
            src="https://spike-nuxtjs-pro-main.netlify.app/images/profile/user-2.jpg"
            alt="avatar"
            class="w-10 h-10 rounded-full cursor-pointer ring-2 ring-gray-200"
          />
          <transition name="fade">
            <div
              v-if="isShowMenu"
              class="absolute right-0 mt-4 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            >
              <div class="p-4 border-b border-gray-200">
                <p class="font-semibold">Nhut HQ</p>
                <p class="text-sm text-gray-600">nhut@gmail.com</p>
              </div>
              <ul>
                <li @click="logout">
                  <a href="#" class="block text-red-500 px-4 py-2 rounded-md hover:bg-gray-200 transition-all duration-300"
                    >Logout</a
                  >
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.router-link-exact-active:hover {
  color: white;
  transition: all 0.3s ease;
}
.router-link-exact-active {
  transition: all 0.3s ease;
  --tw-bg-opacity: 1;
  background-color: #667eea;
  font-weight: 600;
  padding-top: 0.5rem /* 8px */;
  padding-bottom: 0.5rem /* 8px */;
  padding-left: 0.5rem /* 8px */;
  padding-right: 0.5rem /* 8px */;
  /* border-radius: 0.375rem  */
  color: white;
  cursor: pointer;
}
</style>
