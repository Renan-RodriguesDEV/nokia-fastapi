def calculate_stock(count: int, stock: int):
    if stock < 1 or (stock - count) < 1:
        return 0
    return stock - count


def calculate_value(count: int, value: float):
    return value * count
