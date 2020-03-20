<template>
  <el-table
    class="DriverListDiv"
    :data="selfTableData"
    style="width: 100%"
    @row-click="selectTableRow"
    border>
    <el-table-column
      class-name="customerNameCol"
      min-width="25%"
      prop="userName"
      label="司机">
    </el-table-column>
    <el-table-column
      min-width="25%"
      prop="distance"
      label="距离">
    </el-table-column>
    <el-table-column
      min-width="20%"
      prop="workStatus"
      class-name="workStatus"
      label="状态">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'DriverList',
  props: {
    className: {
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
