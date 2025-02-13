<template>
    <div v-show="postStore.isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-[500px] md:w-[600px] lg:w-[800px]">
            <slot /> <!-- コンテンツを動的に変更できるようにする -->
            <h1 class="text-center text-xl mb-4">投稿編集</h1>
            <textarea v-model="postStore.editingContent" class="block mx-auto rounded w-72 h-40 text-white bg-gray-900 border-2 border-gray-300 my-2 p-2 outline-none sm:w-[400px] md:w-[500px] lg:w-[700px] sm:h-40 md:h-48 lg:h-56">
            </textarea>
            <div class="flex justify-between mx-auto w-72 sm:w-[400px] md:w-[500px] lg:w-[700px]">
                <button @click="postStore.closeModal" class="mt-4 px-4 py-2 bg-gray-500 text-white rounded min-w-[120px] hover:bg-gray-700">
                    閉じる
                </button>
                <button @click="postStore.updateContent" class="mt-4 px-4 py-2 bg-gray-500 text-white rounded min-w-[120px] hover:bg-gray-700">
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
