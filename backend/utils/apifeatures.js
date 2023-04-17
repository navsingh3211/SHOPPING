class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", //case insentative
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    //using spread operator to avaoid reference value duplication
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // console.log(queryCopy);

    //filter for Price and Rating
    let queryStr = JSON.stringify(queryCopy); //converting into string
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //string

    //   console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultperPage) {
      const currentPerPage = Number(this.queryStr.page) || 1; //50-10
      const skip = resultperPage * (currentPerPage - 1);
      this.query = this.query.limit(resultperPage).skip(skip);
      return this;
  }
}

module.exports = ApiFeatures;
