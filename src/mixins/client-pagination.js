import Loading from '@/components/App/Loading'

export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [5, 10, 20, 30],
        total: 0
      },
      searchQuery: '',
      searchedData: []
    }
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      } else {
        if (this.searchQuery) {
          result = []
        }
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    }
  },
  methods: {
    changeLoading() {
      this.loading = !this.loading
    },
    sortChange({ prop, order }) {
      if (prop) {
        this.tableData.sort((a, b) => {
          let aVal = a[prop];
          let bVal = b[prop];
          if (order === 'ascending') {
            return aVal > bVal ? 1 : -1
          }
          return bVal - aVal ? 1 : -1
        })
      } else {
        this.tableData.sort((a, b) => {
          return a.id - b.id
        })
      }
    }
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    async searchQuery(value) {
      let result = this.tableData;

      if (value !== '') result = await this.searchApi(value);

      this.searchedData = result;
    }
  }
}
