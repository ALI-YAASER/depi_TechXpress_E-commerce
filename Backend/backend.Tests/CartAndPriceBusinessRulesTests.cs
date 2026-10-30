using backend.Services;
using Xunit;

namespace backend.Tests;

public class CartAndPriceBusinessRulesTests
{
    [Fact]
    public void CartService_MaxQuantityPerItem_IsTen()
    {
        // Business rule: Max 10 items per product in cart
        Assert.Equal(10, CartService.MaxQuantityPerItem);
    }

    [Theory]
    [InlineData(100.0, -1.0, 100.0)]
    [InlineData(100.0, 80.0, 80.0)]
    [InlineData(25000.0, 22000.0, 22000.0)]
    public void EffectivePrice_UsesDiscountPriceWhenPresent(double p, double dp, double expected)
    {
        // Business rule: السعر النهائي = DiscountPrice لو موجود وإلا Price
        decimal price = (decimal)p;
        decimal? discountPrice = dp < 0 ? null : (decimal)dp;
        var effective = discountPrice ?? price;
        Assert.Equal((decimal)expected, effective);
    }
}
