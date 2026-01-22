import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    isCompleted() {
      return this.status === "completed";
    }

    isPending() {
      return this.status === "pending";
    }

    isFailed() {
      return this.status === "failed";
    }

    isCancelled() {
      return this.status === "cancelled";
    }

    getFormattedAmount() {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(this.amount);
    }
  }

  Payment.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Order ID không được để trống",
          },
          notEmpty: {
            msg: "Order ID không được để trống",
          },
        },
      },
      payment_method: {
        type: DataTypes.ENUM("cod", "sepay", "vnpay"),
        allowNull: false,
        defaultValue: "cod",
        validate: {
          isIn: {
            args: [["cod", "sepay", "vnpay"]],
            msg: "Phương thức thanh toán không hợp lệ",
          },
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Số tiền không được để trống",
          },
          min: {
            args: [0],
            msg: "Số tiền phải lớn hơn 0",
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "completed",
          "failed",
          "cancelled",
        ),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [
              ["pending", "processing", "completed", "failed", "cancelled"],
            ],
            msg: "Trạng thái thanh toán không hợp lệ",
          },
        },
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      payment_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      callback_data: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    },
  );

  return Payment;
};
