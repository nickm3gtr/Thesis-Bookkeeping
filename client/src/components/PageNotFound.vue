<template>
  <div class="not-found">
    <v-container fluid class="my-6">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md8>
          <v-card class="mt-8">
            <v-toolbar flat dark class="error">
              <v-toolbar-title>
                <span>Error</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert dense text type="error" class="text-center mx-4">
                404 The page you requested was not found.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>

<style scoped>

</style>
