class CreateViews < ActiveRecord::Migration
  def change
    create_table :views do |t|
      t.references :user, index: true
      t.references :story, index: true

      t.timestamps null: false
    end
  end
end
