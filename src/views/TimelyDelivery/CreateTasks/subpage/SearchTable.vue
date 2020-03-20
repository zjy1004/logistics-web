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
      min-width="25%"
      prop="clientName"
      class-name="customerNameCol"
      :label="type">
    </el-table-column>
    <el-table-column
      min-width="20%"
      prop="phone"
      class-name="customerPhoneCol"
      label="联系电话">
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
