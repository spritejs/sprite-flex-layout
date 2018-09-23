<template>
<div style="display:flex;flex-direction:column;height:100vh" @click="changeStatus">
  <div style="padding:20px;background:#fff;">
    <el-radio v-model="renderType" label="flex">浏览器Flex渲染</el-radio>
    <el-radio v-model="renderType" label="absolute">计算出的样式渲染</el-radio>

    <el-button type="primary" style="margin-left:50px;" @click="addFlexItem">添加元素</el-button>
    <el-button type="danger" :disabled="canDisabled" @click="deleteFlexItem">删除元素</el-button>
    <el-button type="success" @click="addTestCase">添加到测试用例</el-button>
  </div>
  <div class="flex-container" :style="flexWrapStyle">
    <div v-if="renderType === 'flex'" class="shadow flex-render-container flex-render-flex" :style="flexContainerStyle" :class="flexContainerActive" @click="editFlexContainer($event)">
      <div class="shadow flex-item" :class="itemActiveClass(index)" @click="editFlexItem(index, $event)" v-for="(item, index) in flexItems" :style="getFlexItemStyle(index)" v-bind:key="index + 1">
        {{index + 1}}
      </div>
    </div>
    <div v-if="renderType === 'absolute'" class="shadow flex-render-container flex-render-absolute">
      <div class="shadow absolute-item"  v-for="(item, index) in absoluteItems" :style="getAbsoluteItemStyle(index)" v-bind:key="index + 1">
        {{index + 1}}
      </div>
    </div>
  </div>
</div>
</template>
<script>
import event from './event.js';
import Vue from 'vue';
import {getRender, addTestCase} from '../js/api.js';

const backgroundColors = [
  '#fff',
  '#4cb4e7',
  '#ffc09f',
  '#ffee93',
  '#e2dbbe',
  '#a3a380',
  '#DB9019',
  '#5ED5D1',
  '#1A2D27',
  '#FF6E97',
  '#F1AAA6',
  '#F6D6FF',
  '#B85A9A',
  '#9DD3FA',
  '#DFB5B7'
]
export default {
  data() {
    return {
      renderType: 'flex',
      flexWrapStyle: {},
      flexContainerProperties: {},
      flexContainerActive: '',
      flexContainerStyle: {},
      activeIndex: -1,
      flexItems: [],
      absoluteItems: [],
      absoluteContainerProperties: {}
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
    addTestCase() {
      addTestCase(this.flexContainerProperties, this.flexItems).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
      }).catch(err => {
        this.$message.error('添加失败');
        console.error(err);
      })
    },
    getRender() {
      getRender(this.flexContainerProperties, this.flexItems).then(data => {
        this.absoluteContainerProperties = {
          top: data.top,
          left: data.left,
          width: data.width,
          height: data.height
        }
        this.absoluteItems = data.children.map((item) => {
          return {top: item.top, left: item.left, width: item.width, height: item.height};
        })
      })
    },
    changeStatus() {
      return;
      this.activeIndex = -1;
      this.flexContainerActive = '';
      event.$emit('showFlexAside', '', {})
    },
    addFlexItem() {
      const index = this.activeIndex;
      this.activeIndex = this.flexItems.length;
      event.$emit('getFlexStyle', 'item');
      this.activeIndex = index;
      this.getRender();
    },
    deleteFlexItem() {
      if(this.activeIndex === -1) return;
      Vue.delete(this.flexItems, this.activeIndex);
      this.activeIndex = -1;
      this.getRender();
    },
    parseStyle(props, index) {
      const ret = {};
      const p = [
        'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'border-top', 'border-right', 'border-bottom', 'border-left',
        'top', 'left', 'flex-basis'
      ];

      Object.keys(props).forEach((item) => {
        if(!props[item]) return;
        let newItem = item.replace(/[A-Z]/g, a => {
          return '-' + a.toLowerCase()
        });
        if(p.includes(newItem)) {
          if(newItem.startsWith('border-')) {
            newItem += '-width';
          }
          ret[newItem] = /^[\d\.]+$/.test(props[item]) ? props[item] + 'px' : props[item];
        } else {
          ret[newItem] = props[item];
        }
      })
      ret['background-color'] = backgroundColors[index];
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
    getAbsoluteItemStyle(index) {
      const item = this.absoluteItems[index];
      const properties = this.parseStyle(item, index + 1);
      return properties;
    },
    getFlexItemStyle(index) {
      const item = this.flexItems[index];
      const properties = this.parseStyle(item, index + 1);
      return properties;
    },
    changeFlexItemProperties(properties) {
      if(this.activeIndex === -1) return;
      Vue.set(this.flexItems, this.activeIndex, properties);
      this.getRender();
    },
    changeFlexContainerProperties(properties) {
      this.flexContainerProperties = Object.assign({}, properties);
      this.flexWrapStyle = {
        width: properties.width + 'px',
        minWidth: properties.width + 'px',
        height: properties.height + 'px',
        minHeight: properties.height + 'px',
      };
      this.flexContainerStyle = this.parseStyle(properties, 0);
      this.getRender();
    },
    editFlexContainer(evt) {
      evt.stopPropagation();
      if(this.flexContainerActive === 'flex-active') return;
      this.flexContainerActive = 'flex-active';
      this.activeIndex = -1;
      event.$emit('showFlexAside', 'container', Object.assign({}, this.flexContainerProperties))
    }
  }
}
</script>
