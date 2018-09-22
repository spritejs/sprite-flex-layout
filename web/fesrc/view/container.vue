<template>
<div style="display:flex;flex-direction:column;height:100vh">
  <div style="padding:20px;background:#fff;">
    <el-checkbox v-model="renderFlex">浏览器Flex渲染</el-checkbox>
    <el-checkbox v-model="renderAbsolute">计算出的样式渲染</el-checkbox>

    <el-button type="primary" style="margin-left:50px;" @click="addFlexItem">添加元素</el-button>
    <el-button type="danger" :disabled="canDisabled" @click="deleteFlexItem">删除元素</el-button>
  </div>
  <div class="flex-container" :style="flexWrapStyle">
    <div v-if="renderFlex" class="shadow flex-render-container flex-render-flex" :style="flexContainerStyle" :class="flexContainerActive" @click="editFlexContainer">
      <div class="shadow" :class="itemActiveClass(index)" @click="editFlexItem(index, $event)" v-for="(item, index) in flexItems" :style="getFlexItemStyle(index)" v-bind:key="index + 1">
        {{index + 1}}
      </div>
    </div>
    <div v-if="renderAbsolute" class="shadow flex-render-container"></div>
  </div>
</div>
</template>
<script>
import event from './event.js';
import Vue from 'vue';
export default {
  data() {
    return {
      renderFlex: true,
      renderAbsolute: false,
      flexContainer: {},
      flexContainerProperties: {},
      flexContainerActive: '',
      activeIndex: -1,
      flexItems: [],
      flexWrapStyle: {},
      flexContainerStyle: {}
    }
  },
  mounted() {
    event.$on('changeFlexContainerProperties', this.changeFlexContainerProperties);
    event.$on('changeFlexItemProperties', this.changeFlexItemProperties);
    event.$emit('getFlexStyle', 'container');
    [...new Array(3)].forEach((item, index) => {
      this.activeIndex = index;
      event.$emit('getFlexStyle', 'item');
    });
    this.activeIndex = -1;
  },
  computed: {
    canDisabled() {
      if(this.flexContainerActive) return true;
      if(this.activeIndex === -1) return true;
      return false;
    }
  },
  beforeDestroy() {
    event.$off('changeFlexContainerProperties', this.changeFlexContainerProperties);
    event.$off('changeFlexItemProperties', this.changeFlexItemProperties);
  },
  methods: {
    addFlexItem() {
      const index = this.activeIndex;
      this.activeIndex = this.flexItems.length;
      event.$emit('getFlexStyle', 'item');
      this.activeIndex = index;
    },
    deleteFlexItem() {
      if(this.activeIndex === -1) return;
      Vue.delete(this.flexItems, this.activeIndex);
      this.activeIndex = -1;
    },
    parseStyle(props) {
      const ret = {};
      const p = [
        'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'border-top', 'border-right', 'border-bottom', 'border-left'
      ];

      Object.keys(props).forEach((item) => {
        if(!props[item]) return;
        const newItem = item.replace(/[A-Z]/g, a => {
          return '-' + a.toLowerCase()
        });
        if(p.includes(newItem)) {
          ret[newItem] = props[item] + 'px'
        } else {
          ret[newItem] = props[item];
        }
      })
      return ret;
    },
    itemActiveClass(index) {
      if(index === this.activeIndex) return 'flex-active'
    },
    editFlexItem(index, evt) {
      evt.stopPropagation();
      this.activeIndex = index;
      this.flexContainerActive = '';
      const item = this.flexItems[index];
      event.$emit('showFlexAside', 'item', Object.assign({}, item))
    },
    getFlexItemStyle(index) {
      const item = this.flexItems[index];
      const properties = this.parseStyle(item);
      return properties;
    },
    changeFlexItemProperties(properties) {
      if(this.activeIndex === -1) return;
      Vue.set(this.flexItems, this.activeIndex, properties);
    },
    changeFlexContainerProperties(properties) {
      this.flexContainerProperties = Object.assign({}, properties);
      this.flexWrapStyle = {
        width: properties.width + 'px',
        minWidth: properties.width + 'px',
        height: properties.height + 'px',
        minHeight: properties.height + 'px',
      };
      this.flexContainerStyle = this.parseStyle(properties);
    },
    editFlexContainer() {
      if(this.flexContainerActive === 'flex-active') return;
      this.flexContainerActive = 'flex-active';
      this.activeIndex = -1;
      event.$emit('showFlexAside', 'container', Object.assign({}, this.flexContainerProperties))
    }
  }
}
</script>
