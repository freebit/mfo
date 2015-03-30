class Document < ActiveRecord::Base
  belongs_to :order, polymorphic: true

  mount_uploader :file, DocumentUploader

  before_destroy :remember_file_id
  after_destroy :remove_id_directory

  def remember_file_id
    @file_id = id
  end

  def remove_id_directory
    FileUtils.remove_dir("#{Rails.root}/public/uploads/#{self.class.to_s.underscore}/#{self.file.mounted_as}/#{@file_id}", :force => true)
  end

end
