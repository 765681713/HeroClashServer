var Result = function () {
    this.resultCode = Result.NO_ERROR;
    this.resultData = {};
    this.resultMessage = "";
};

Result.NO_ERROR = 0;//无错误
Result.ILLEGAL_ARGUMENT_ERROR_CODE = 1;//无效参数错误
Result.BUSINESS_ERROR_CODE = 2;//业务错误
Result.AUTH_ERROR_CODE = 3;//认证错误
Result.SERVER_EXCEPTION_ERROR_CODE = 5;//服务器未知错误
Result.TARGET_NOT_EXIT_ERROR_CODE = 6;//目标不存在错误

module.exports = Result;