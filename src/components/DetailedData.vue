<template>
  <div class="flex column fullwidth">
    <template v-for="(value, key) in detailedData" :key="key">
      <div v-if="!Array.isArray(value)" class="flex column my-2 px-1">
        <div class="title">
          <strong>{{ transformTitle(key) }}</strong>
        </div>
        <div>
          <Copy wrap :value="transformValue(key, value)" />
        </div>
      </div>
      <div v-else class="my-2">
        <div class="title">
          <strong>{{ transformTitle(key) }}</strong>
        </div>
        <div>
          <div v-for="(a, i) in value" :key="i">
            <template v-if="typeof a === 'object'">
              <template v-for="(v, k) in a" :key="k">
                <div class="flex">
                  <div class="flex-2">
                    <strong class="subtitle">{{ transformTitle(k) }}:</strong>
                  </div>
                  <div class="flex-9">
                    <Copy :value="v" />
                  </div>
                </div>
              </template>
            </template>
            <div class="flex" v-else>
              -&nbsp; <Copy wrap :value="transformValue(key, a)" />
            </div>
          </div>
        </div>
      </div>
      <hr />
    </template>
  </div>
</template>

<script>
import { inject, onMounted, onUnmounted, reactive } from 'vue';
import {
  _parseDate,
  _transformMonetaryUnit,
  _splitCamelCaseWords,
  _capitalize,
} from '../utils';

import Copy from './Copy';

export default {
  name: 'DetailedData',
  props: {
    data: { type: Object, default: {} },
    prependFn: { type: Function, default: null },
  },
  components: { Copy },
  setup(props) {
    const store = inject('store');

    const titleTransformations = {
      timestamp: 'Date',
    };

    const detailedData = reactive({ ...props.data });

    onMounted(async () => {
      if (props.prependFn) {
        const { key, value } = await props.prependFn(detailedData);
        detailedData[key] = value;
      }
    });

    const valueTransformations = {
      timestamp: val => _parseDate(val),
      balance: val =>
        _transformMonetaryUnit(val, store.state.config.networkSymbol),
      amount: val =>
        _transformMonetaryUnit(val, store.state.config.networkSymbol),
      fee: val => _transformMonetaryUnit(val, store.state.config.networkSymbol),
      type: val => _capitalize(_splitCamelCaseWords(val).join(' ')),
    };

    const transformTitle = key =>
      titleTransformations[key] || _splitCamelCaseWords(key).join(' ');

    const transformValue = (key, value) =>
      valueTransformations[key] ? valueTransformations[key](value) : value;

    return {
      detailedData,
      transformTitle,
      transformValue,
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 13px;
  text-transform: capitalize;
}

.subtitle {
  font-size: 12px;
  text-transform: capitalize;
}
</style>
