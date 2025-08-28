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
    M1 = "M1"
    M2 = "M2"
    M3 = "M3"
    M4 = "M4"
    M6 = "M6"
    Y1 = "Y1"
    Y2 = "Y2"
    Y3 = "Y3"
    Y5 = "Y5"
    Y7 = "Y7"
    Y10 = "Y10"
    Y20 = "Y20"
    Y30 = "Y30"
