<template>
  <el-table
    class="searchTableDiv"
    :data="selfTableData"
    style="width: 100%"
    @row-click="selectTableRow"
    border>
    <el-table-column
      class-name="addressCol"
      min-width="25%"
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      min-width="20%"
      prop="phone"
      class-name="customerPhoneCol"
      label="联系电话">
    </el-table-column>
    <el-table-column
      min-width="20%"
      prop="clientName"
      class-name="customerNameCol"
      :label="labelName">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'SearchTable',
  props: {
    className: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selfTableData: []
    }
  },
  watch: {
    tableData: {
      handler (newValue, oldValue) {
        this.selfTableData = newValue
      },
      deep: true
    }

  },
  computed: {
    labelName () {
      if (this.type === 'receive') {
        return '收货方名称'
      } else {
        return '发货方名称'
      }
    }
  },
  created () {
    this.selfTableData = this.tableData
  },
  methods: {
    selectTableRow (row, event) {
      this.$emit('click-select-table-row', row, event)
    }
  }
}
</script>
