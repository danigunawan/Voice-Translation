class CreateCommands < ActiveRecord::Migration[5.0]
  def change
    create_table :commands do |t|
      t.text :keywords
      t.string :description
      t.text :response

      t.timestamps
    end
  end
end
