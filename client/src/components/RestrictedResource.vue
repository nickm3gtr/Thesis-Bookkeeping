<template>
  <div class="restricted">
    <v-container fluid class="my-6">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12 mt-8">
            <v-toolbar flat dark class="error">
              <v-toolbar-title>
                <span>Error</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert dense text type="error" class="mx-4">
                This is a restricted page. You will need to register or login an account.
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
  name: 'RestrictedResource'
}
</script>

<style scoped>

</style>
