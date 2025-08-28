from enum import StrEnum


class OrderType(StrEnum):
    BUY = "BUY"
    SELL = "SELL"


class OrderStatus(StrEnum):
    PENDING = "PENDING"
    OPEN = "OPEN"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"


class Maturity(StrEnum):
    M1 = "1 MONTH"
    M2 = "2 MONTH"
    M3 = "3 MONTH"
    M4 = "4 MONTH"
    M6 = "6 MONTH"
    Y1 = "1 YEAR"
    Y2 = "2 YEAR"
    Y3 = "3 YEAR"
    Y5 = "5 YEAR"
    Y7 = "7 YEAR"
    Y10 = "10 YEAR"
    Y20 = "20 YEAR"
    Y30 = "30 YEAR"
