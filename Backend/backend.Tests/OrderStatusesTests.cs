using backend.Helpers;
using Xunit;

namespace backend.Tests;

public class OrderStatusesTests
{
    [Theory]
    [InlineData(OrderStatuses.Pending, OrderStatuses.Processing, true)]
    [InlineData(OrderStatuses.Pending, OrderStatuses.Cancelled, true)]
    [InlineData(OrderStatuses.Pending, OrderStatuses.Shipped, false)]
    [InlineData(OrderStatuses.Pending, OrderStatuses.Delivered, false)]
    [InlineData(OrderStatuses.Processing, OrderStatuses.Shipped, true)]
    [InlineData(OrderStatuses.Processing, OrderStatuses.Cancelled, true)]
    [InlineData(OrderStatuses.Processing, OrderStatuses.Delivered, false)]
    [InlineData(OrderStatuses.Shipped, OrderStatuses.Delivered, true)]
    [InlineData(OrderStatuses.Shipped, OrderStatuses.Cancelled, false)]
    [InlineData(OrderStatuses.Delivered, OrderStatuses.Cancelled, false)]
    [InlineData(OrderStatuses.Cancelled, OrderStatuses.Processing, false)]
    public void CanTransition_ValidatesAllowedStateTransitions(string from, string to, bool expected)
    {
        var result = OrderStatuses.CanTransition(from, to);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("pending", OrderStatuses.Pending)]
    [InlineData("PROCESSING", OrderStatuses.Processing)]
    [InlineData("shipped", OrderStatuses.Shipped)]
    [InlineData(" Delivered ", OrderStatuses.Delivered)]
    [InlineData("cancelled", OrderStatuses.Cancelled)]
    [InlineData("UnknownStatus", null)]
    [InlineData("", null)]
    [InlineData(null, null)]
    public void Normalize_ReturnsCanonicalNameOrNull(string? input, string? expected)
    {
        var result = OrderStatuses.Normalize(input);
        Assert.Equal(expected, result);
    }
}
