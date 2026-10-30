using backend.Helpers;
using Xunit;

namespace backend.Tests;

public class PaginationTests
{
    [Fact]
    public void PaginationParams_Defaults_Page1PageSize12()
    {
        var p = new PaginationParams();
        Assert.Equal(1, p.Page);
        Assert.Equal(12, p.PageSize);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(-5, 1)]
    [InlineData(5, 5)]
    public void PaginationParams_Page_NeverLessThanOne(int input, int expected)
    {
        var p = new PaginationParams { Page = input };
        Assert.Equal(expected, p.Page);
    }

    [Theory]
    [InlineData(0, 12)]
    [InlineData(-10, 12)]
    [InlineData(25, 25)]
    [InlineData(100, 50)] // MaxPageSize is 50
    public void PaginationParams_PageSize_ClampedBetween12And50(int input, int expected)
    {
        var p = new PaginationParams { PageSize = input };
        Assert.Equal(expected, p.PageSize);
    }

    [Theory]
    [InlineData(0, 12, 0)]
    [InlineData(12, 12, 1)]
    [InlineData(13, 12, 2)]
    [InlineData(50, 10, 5)]
    [InlineData(51, 10, 6)]
    public void PagedResult_TotalPages_CalculatedCorrectly(int totalCount, int pageSize, int expectedPages)
    {
        var result = new PagedResult<string>
        {
            TotalCount = totalCount,
            PageSize = pageSize
        };
        Assert.Equal(expectedPages, result.TotalPages);
    }
}
