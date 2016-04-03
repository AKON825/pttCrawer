module.exports = Article

function Article () {
  if (!(this instanceof Article)) {
    return new Article()
  }

  this.schema = {
    /**
     * id
     */
    id: { type: 'increments', nullable: false, primary: true },

    /**
     * 作者
     */
    author: { type: 'text', nullable: false },

    /**
     * 標題
     */
    title: { type: 'text', nullable: false },

    /**
     * 內容
     */
    content: { type: 'text', nullable: false }
  }

  this.entityMethod = {
    tableName: 'article',
    defaults: {},

    /**
     * 取得id
     */
    getId: function () {
      return this.get('id')
    },

    /**
     * 取得author
     */
    getAuthor: function () {
      return this.get('author')
    },

    /**
     * 設定author
     *
     * @param {String} author
     */
    setAuthor: function (author) {
      this.set('author', author)

      return this
    },

    /**
     * 取得title
     */
    getTitle: function () {
      return this.get('title')
    },

    /**
     * 設定title
     *
     * @param {String} title
     */
    setTitle: function (title) {
      this.set('title', title)

      return this
    },

    /**
     * 取得content
     */
    getContent: function () {
      return this.get('content')
    },

    /**
     * 設定content
     *
     * @param {String} content
     */
    setContent: function (content) {
      this.set('content', content)

      return this
    },

    /**
     * 輸出所有欄位
     */
    toArray: function () {
      return {
        id: this.get('id'),
        title: this.get('title'),
        title: this.get('title'),
        content: this.get('content'),
      }
    }
  }

  this.repoMethod = {
  }
}
