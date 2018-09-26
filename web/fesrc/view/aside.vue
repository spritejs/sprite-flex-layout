<template>
  <div style="padding: 20px;padding-left:0">
    <el-form ref="form" :model="form" label-width="110px">
      <div v-if="type === 'container'">
        <el-form-item v-if="type === 'container'" label="flex-direction">
          <el-select v-model="flexContainer.flexDirection" placeholder="flexDirection" @change="changeProperty('flexDirection', $event)">
            <el-option label="row" value="row"></el-option>
            <el-option label="row-reverse" value="row-reverse"></el-option>
            <el-option label="column" value="column"></el-option>
            <el-option label="column-reverse" value="column-reverse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'container'" label="flex-wrap">
          <el-select v-model="flexContainer.flexWrap" placeholder="flexWrap" @change="changeProperty('flexWrap', $event)">
            <el-option label="nowrap" value="nowrap"></el-option>
            <el-option label="wrap" value="wrap"></el-option>
            <el-option label="wrap-reverse" value="wrap-reverse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'container'" label="justify-content">
          <el-select v-model="flexContainer.justifyContent" placeholder="justifyContent" @change="changeProperty('justifyContent', $event)">
            <el-option label="flex-start" value="flex-start"></el-option>
            <el-option label="flex-end" value="flex-end"></el-option>
            <el-option label="center" value="center"></el-option>
            <el-option label="space-between" value="space-between"></el-option>
            <el-option label="space-around" value="space-around"></el-option>
            <el-option label="space-evenly" value="space-evenly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'container'" label="align-items">
          <el-select v-model="flexContainer.alignItems" placeholder="alignItems" @change="changeProperty('alignItems', $event)">
            <el-option label="stretch" value="stretch"></el-option>
            <el-option label="flex-start" value="flex-start"></el-option>
            <el-option label="center" value="center"></el-option>
            <el-option label="flex-end" value="flex-end"></el-option>
            <el-option disabled label="baseline" value="baseline"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'container'" label="align-content">
          <el-select v-model="flexContainer.alignContent" placeholder="alignContent" @change="changeProperty('alignContent', $event)">
            <el-option label="stretch" value="stretch"></el-option>
            <el-option label="flex-start" value="flex-start"></el-option>
            <el-option label="center" value="center"></el-option>
            <el-option label="flex-end" value="flex-end"></el-option>
            <el-option label="space-between" value="space-between"></el-option>
            <el-option label="space-around" value="space-around"></el-option>
            <el-option label="space-evenly" value="space-evenly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="width">
          <el-input v-model="flexContainer.width" type="text" @change="changeProperty('width', $event)"></el-input>
        </el-form-item>
        <el-form-item label="height">
          <el-input v-model="flexContainer.height" type="text" @change="changeProperty('height', $event)"></el-input>
        </el-form-item>
      </div>
      <div v-if="type === 'item'">
        <el-form-item label="align-self">
          <el-select v-model="flexItem.alignSelf" placeholder="alignSelf" @change="changeProperty('alignSelf', $event)">
            <el-option label="auto" value="auto"></el-option>
            <el-option label="stretch" value="stretch"></el-option>
            <el-option label="flex-start" value="flex-start"></el-option>
            <el-option label="center" value="center"></el-option>
            <el-option label="flex-end" value="flex-end"></el-option>
            <el-option disabled label="baseline" value="baseline"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="flex-grow">
          <el-input v-model="flexItem.flexGrow" type="text" @change="changeProperty('flexGrow', $event)"></el-input>
        </el-form-item>
        <el-form-item label="flex-shrink">
          <el-input v-model="flexItem.flexShrink" type="text" @change="changeProperty('flexShrink', $event)"></el-input>
        </el-form-item>
        <el-form-item label="flex-basis">
          <el-input v-model="flexItem.flexBasis" @change="changeProperty('flexBasis', $event)"></el-input>
        </el-form-item>
        <el-form-item label="width">
          <el-input v-model="flexItem.width" type="text" @change="changeProperty('width', $event)"></el-input>
        </el-form-item>
        <el-form-item label="min-width">
          <el-input v-model="flexItem.minWidth" type="text" @change="changeProperty('minWidth', $event)"></el-input>
        </el-form-item>
        <el-form-item label="max-width">
          <el-input v-model="flexItem.maxWidth" type="text" @change="changeProperty('maxWidth', $event)"></el-input>
        </el-form-item>

        <el-form-item label="height">
          <el-input v-model="flexItem.height" type="text" @change="changeProperty('height', $event)"></el-input>
        </el-form-item>
        
        <el-form-item label="min-height">
          <el-input v-model="flexItem.minHeight" type="text" @change="changeProperty('minHeight', $event)"></el-input>
        </el-form-item>

        <el-form-item label="max-height">
          <el-input v-model="flexItem.maxHeight" type="text" @change="changeProperty('maxHeight', $event)"></el-input>
        </el-form-item>

        <el-form-item label="box-sizing">
          <el-select v-model="flexItem.boxSizing" placeholder="boxSizing" @change="changeProperty('boxSizing', $event)">
            <el-option label="content-box" value="content-box"></el-option>
            <el-option label="border-box" value="border-box"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="order">
          <el-input v-model="flexItem.order" type="text" @change="changeProperty('order', $event)"></el-input>
        </el-form-item>

        <div style="padding: 20px 10px;">
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.borderTop" type="text" @change="changeProperty('borderTop', $event)"></el-input>
          </div>
          <div style="display:flex;margin: 10px">
            <el-input v-model="flexItem.borderLeft" type="text" @change="changeProperty('borderLeft', $event)"></el-input>
            <div style="margin: 10px 20px;">border</div>
            <el-input v-model="flexItem.borderRight" type="text" @change="changeProperty('borderRight', $event)"></el-input>
          </div>
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.borderBottom" type="text" @change="changeProperty('borderBottom', $event)"></el-input>
          </div>
        </div>

        <div style="padding: 20px 10px;">
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.marginTop" type="text" @change="changeProperty('marginTop', $event)"></el-input>
          </div>
          <div style="display:flex;margin: 10px">
            <el-input v-model="flexItem.marginLeft" type="text" @change="changeProperty('marginLeft', $event)"></el-input>
            <div style="margin: 10px 20px;">margin</div>
            <el-input v-model="flexItem.marginRight" type="text" @change="changeProperty('marginRight', $event)"></el-input>
          </div>
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.marginBottom" type="text" @change="changeProperty('marginBottom', $event)"></el-input>
          </div>
        </div>

        <div style="padding: 20px 10px;">
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.paddingTop" type="text" @change="changeProperty('paddingTop', $event)"></el-input>
          </div>
          <div style="display:flex;margin: 10px">
            <el-input v-model="flexItem.paddingLeft" type="text" @change="changeProperty('paddingLeft', $event)"></el-input>
            <div style="margin: 10px 20px;">padding</div>
            <el-input v-model="flexItem.paddingRight" type="text" @change="changeProperty('paddingRight', $event)"></el-input>
          </div>
          <div style="width:80px;margin:auto">
            <el-input v-model="flexItem.paddingBottom" type="text" @change="changeProperty('paddingBottom', $event)"></el-input>
          </div>
        </div>

       


      </div>
      
       <div v-if="type === ''" style="padding: 20px;color:#ccc;font-size: 18px;">
         选中右侧一个元素后进行编辑
       </div>
    </el-form>
  </div>
</template>

<script>
import event from './event.js';
const flexContainer = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  alignContent: 'stretch',
  width: 500,
  height: 500,
};
const flexItem = {
  alignSelf: 'auto',
  flexGrow: 0,
  flexBasis: '',
  flexShrink: 1,
  width: 100,
  minWidth: '',
  maxWidth: '',
  height: 100,
  minHeight: '',
  maxHeight: '',
  borderTop: '',
  borderRight: '',
  borderBottom: '',
  borderLeft: '',
  marginTop: '',
  marginRight: '',
  marginBottom: '',
  marginLeft: '',
  paddingTop: '',
  paddingRight: '',
  paddingBottom: '',
  paddingLeft: '',
  boxSizing: 'content-box',
  order: '',
};
export default {
  data() {
    return {
      type: '',
      flexContainer: Object.assign({}, flexContainer),
      flexItem: Object.assign({}, flexItem),
    }
  },
  mounted() {
    event.$on('showFlexAside', this.showFlexAside);
    event.$on('getFlexStyle', this.getFlexStyle);
  },
  beforeDestroy() {
    event.$off('showFlexAside', this.showFlexAside);
    event.$off('getFlexStyle', this.getFlexStyle);
  },
  methods: {
    getFlexStyle(type) {
      if(type === 'container') {
        event.$emit('changeFlexContainerProperties', Object.assign({}, flexContainer));
      } else if(type === 'item') {
        event.$emit('changeFlexItemProperties', Object.assign({}, flexItem));
      }
    },
    showFlexAside(type, data) {
      this.type = type;
      if (type === 'container') {
        Object.keys(data).forEach((item) => {
          this.flexContainer[item] = data[item];
        });
      } else if(type === 'item') {
        Object.keys(data).forEach((item) => {
          this.flexItem[item] = data[item];
        });
      }
    },
    changeProperty(property, value) {
      if(this.type === 'container') {
        event.$emit('changeFlexContainerProperties', Object.assign({}, this.flexContainer));
      } else if(this.type === 'item') {
        event.$emit('changeFlexItemProperties', Object.assign({}, this.flexItem));
      }
    }
  }
}
</script>
