<template>
  <div style="height: 100vh;" class="d-flex flex-column">
    <!-- Logo -->
    <div class="d-flex justify-left align-center">
      <img src="@/assets/logo.png" alt="Logo" 
        style="height: 50px;" />
    </div>
    

    <!-- CHAT MESSAGES -->
    <!-- User Message -->
    <div style="overflow-y: auto; flex-grow: 1;" class="pa-2">
      <div v-for="message in allMessages" 
      class="d-flex" :class="message.type === 'userMessage' ? 'justify-end' : 'justify-start'">
      <span v-if="message.type == 'userMessage'" 
        class="pa-2 my-2 rounded-lg"
        style="background-color: lightgray; ">
        {{ message.message }}
      </span>
      <!-- AI Response -->
      <span v-else v-html="message.message" class="ml-6"></span>
    </div>
    </div>

    <!-- Textarea and send button -->
    <div class="pa-2" style="border-top: 1px solid #ddd;">
      <v-textarea 
        v-model="inputMessage"
        hide-details
        variant="outlined"
        auto-grow
        label="Ask your graph questions here"
      />
      <div class="d-flex justify-end mt-2">
        <v-btn
          @click="sendRequest"
          :loading="sendLoading"
          size="small"
          icon
          variant="text"
          class="bg-black"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { OpenAI } from 'openai'

const inputMessage = ref('')
const allMessages = ref([])
var sendLoading = ref(false)

onMounted(() => {
})
console.log(import.meta.env)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

async function sendRequest(){
  sendLoading = true
  
  allMessages.value.push({
    message: inputMessage.value,
    type: 'userMessage'
  })

  try {
    const res = await fetch('/miserables.json')
    const graphjson = await res.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a graph analyst. Answer questions about a network graph structure. When you respond please give your answer in html format' },
        {
          role: 'user',
          content: `This is the graph structure (nodes and links in JSON format):\n\n${JSON.stringify(graphjson)}\n\nPlease answer the following question:\n${inputMessage.value}`
        }
      ]
    })

    console.log(response)

    const aiMessage = response?.choices?.[0]?.message?.content

    if (!aiMessage) {
      console.warn('No AI message found in response.')
    } else {
      allMessages.value.push({
        message: aiMessage,
        type: 'openAIResponse'
      })
    }
  } catch (error) {
    allMessages.value.push({
      message: 'Error: Unable to process your request at the moment.',
      type: 'openAIResponse'
    })
  }
  inputMessage.value = ''
  sendLoading = false
}
</script>

<style scoped>
</style>