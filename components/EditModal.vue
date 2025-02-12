<template>
    <div v-show="postStore.isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <slot /> <!-- コンテンツを動的に変更できるようにする -->
            <h1 class="text-center">編集</h1>
            <textarea v-model="postStore.editingContent" class="block mx-auto rounded w-72 h-32 text-white bg-gray-900 border-2 border-gray-300 my-2 p-2 outline-none">
            </textarea>
            <div class="flex justify-between">
                <button @click="postStore.closeModal" class="mt-4 px-4 py-2 bg-gray-500 text-white rounded min-w-[120px]">
                    閉じる
                </button>
                <button @click="postStore.updateContent" class="mt-4 px-4 py-2 bg-gray-500 text-white rounded min-w-[120px]">
                    更新
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { usePostStore } from '~/store/post';

const postStore = usePostStore();
</script>

<style scoped>

</style>
