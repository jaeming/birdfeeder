class CreateHashtags < ActiveRecord::Migration
  def change
    create_table :hashtags do |t|
      t.string :title
      t.string :feed

      t.timestamps null: false
    end
  end
end
